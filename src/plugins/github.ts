/*
 * github.ts
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
 */

import { Octokit } from '@octokit/rest';
import logger from './logger';
import { User } from '@/interface/user';
import {
	Tree,
	Blob,
	BlobEncoding,
	Permission,
	Owner,
	Repository,
	TreeRef,
	GitContent,
	AnyTree,
	ContentType,
} from '@/interface/github';
import path from 'path';
import yaml from 'js-yaml';
import * as submodule from 'git-submodule-js';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class Github {

	public repo!: Repository;

	private octokit!: Octokit;
	private commitList: Blob[] = [];
	private user!: any;

	private repoTree!: {
		tree: AnyTree[],
		sha: string,
		ref: string,
	};
	private curTree: Tree<'tree'> = {};
	private refStr: string = '';
	private newTree!: any;

	constructor(user?: any) {
		if ( user ) {
			this.setUser(user);
		}
		this.initTree();
	}

	get rest() {
		return this.octokit.rest;
	}

	get User() {
		return this.user;
	}

	get Added() {
		return this.curTree;
	}

	get Tree() {
		return this.repoTree;
	}

	public setUser(user: any) {
		this.user = user;
		this.octokit = new Octokit({
			auth: user.accessToken,
		});
	}

	public async initRepo(repo: string) {
		const { data } = await this.rest.repos.get({
			owner: this.user.userName,
			repo,
		});
		this.repo = data as Repository;
		this.repoTree = await this.getTreeByRef();
		return this.repo;
	}

	public async getContent<T extends object>(p: string, type: ContentType = 'utf8', repo: string = ''): Promise<T> {
		let ret: any;
		try {
			const [ user, name ] = repo.split('/');
			const res = await this.rest.repos.getContent({
				owner: user || this.user.userName,
				repo: name || this.repo.name,
				path: p,
			});
			const data = res.data as GitContent;
			switch ( data.encoding ) {
				case 'base64':
					if ( type !== 'base64' ) {
						ret = Buffer.from(data.content, 'base64').toString('utf8');
					} else {
						ret = data.content;
					}
					break;
				default:
					ret = data.content;
			}

			switch ( type ) {
				case 'json':
					ret = JSON.parse(ret) as T;
					break;
				case 'yaml':
					ret = yaml.load(ret) as T;
					break;
				case 'base64':
					if ( data.encoding !== 'base64' ) {
						ret = Buffer.from(ret, 'utf8').toString('base64');
					}
					break;
				case 'submodule':
					ret = submodule.deserialize(ret) as T;
					break;
			}
		} catch (err) {
			// empty
			console.error(err);
		}
		return ret;
	}

	public add(file: string, data: string, encoding: BlobEncoding = 'utf-8') {
		let dep = this.curTree.tree as AnyTree;

		let stack: string[] = [];
		if ( path.dirname(file) !== '.' ) {
			stack = path.dirname(file).split('/');
		}
		file = path.basename(file);
		let cur = '';
		for ( const p of stack ) {
			cur = path.join(cur, p);
			if ( !dep[p] ) {
				dep[p] = {
					type: 'tree',
					mode: '160000',
					tree: {},
				};
				const org = this.repoTree.tree.find((d: AnyTree) => d.path === cur);
				if ( org ) {
					dep[p].sha = org.sha;
				}
			}
			dep = dep[p].tree as AnyTree;
		}

		dep[file] = {
			content: data,
			encoding,
		} as Blob;

		if ( encoding === 'link' ) {
			dep[file].type = 'commit';
			dep[file].mode = '160000';
		} else {
			dep[file].type = 'blob';
			dep[file].mode = '100644';
		}
	}

	public async remove(file: string) {
		const tree: any = this.repoTree.tree as any;
		const idx = tree.findIndex((t: any) => t.path === file);
		if ( idx === -1 ) {
			return;
		}

		const result = tree[idx];
		switch ( result.type ) {
			case 'blob':
				tree[idx] = await this.blob(file);
				break;
			case 'tree':
				const regex = new RegExp(`^${file}/`);
				const tmpTree: any[] = [];
				for ( const t of tree ) {
					const tp = t.path as string;
					if ( tp === file || tp.match(regex) ) {
						if ( t.type === 'blob' ) {
							tmpTree.push(await this.blob(tp));
						}
					} else {
						tmpTree.push(t);
					}
				}
				this.repoTree.tree = tmpTree;
				break;
		}
	}

	public async update(file: string, data: string, encoding: BlobEncoding = 'utf-8') {
		const tree: any = this.repoTree.tree as any;
		const idx = tree.findIndex((t: any) => t.path === file);
		if ( idx === -1 ) {
			return;
		}

		const blob: Blob = {
			content: data,
			encoding,
			type: 'blob',
			mode: '100644',
		};
		tree[idx] = await this.blob(file, blob);
	}

	public async done() {
		const build = await this.buildTree(this.curTree);
		const treeData = this.repoTree;
		const treeObj = treeData.tree;

		for ( const b of build ) {
			const idx = treeObj.findIndex((tree: AnyTree) => tree.path === b.path);
			if ( idx === -1 ) {
				// new file
				treeObj.push(b);
			} else {
				// update file
				treeObj[idx] = b;
			}
		}
	}

	public async commit(message: string) {
		const newTree = await this.tree(this.repoTree.tree, this.repoTree.sha);
		await this.treeCommit(newTree, message);
	}

	public async clear() {
		await this.initRepo(this.repo.name);
		this.initTree();
	}

	public async workflowClear() {
		let res: any = await this.rest.actions.listRepoWorkflows({
			owner: this.user.userName,
			repo: this.repo.name,
		});

		const wf = res.data.workflows.find((w: any) => w.name === 'build CI');
		if ( wf ) {
			res = await this.rest.actions.listWorkflowRuns({
				owner: this.user.userName,
				repo: this.repo.name,
				workflow_id: wf.id,
			});

			const runs: any[] = res.data.workflow_runs.filter((w: any) => w.status === 'in_progress');
			for ( const run of runs ) {
				await this.rest.actions.cancelWorkflowRun({
					owner: this.user.userName,
					repo: this.repo.name,
					run_id: run.id,
				});
			}
		}
	}

	public exists(file: string) {
		const { tree } = this.repoTree;
		for ( const t of tree ) {
			if ( t.path === file ) {
				return true;
			}
		}
		return false;
	}

	public async getTreeByRef(repo: string = '', ref?: string, recursive: boolean = false): Promise<any> {
		const ret: TreeRef = { success: false };
		if ( !ref ) {
			ref = `heads/${this.repo.default_branch}`;
		}
		this.refStr = ref;

		const [ user, name ] = repo.split('/');
		let res: any = await this.rest.git.getRef({
			owner: user || this.user.userName,
			repo: name || this.repo.name,
			ref,
		});

		const obj = res.data.object;
		if ( obj.type === 'commit' ) {
			res = await this.rest.git.getCommit({
				owner: user || this.user.userName,
				repo: name || this.repo.name,
				commit_sha: obj.sha,
			});

			res = await this.rest.git.getTree({
				owner: user || this.user.userName,
				repo: name || this.repo.name,
				tree_sha: res.data.sha,
				recursive: recursive.toString(),
			});

			ret.tree = res.data.tree as AnyTree[];
			ret.sha = res.data.sha;
			ret.ref = obj.sha;
			ret.success = true;
		}
		return ret;
	}

	private async treeCommit(newTree: any, message: string) {
		const treeData = this.repoTree;

		const { data } = await this.rest.git.createCommit({
			owner: this.user.userName,
			repo: this.repo.name,
			message,
			tree: newTree.sha,
			author: {
				name: this.user.userName,
				email: this.user.email,
			},
			parents: [ treeData.sha ],
		});

		const commitSha = data.sha;
		await sleep(100);

		await this.rest.git.updateRef({
			owner: this.user.userName,
			repo: this.repo.name,
			ref: this.refStr,
			sha: commitSha,
		});
	}

	private getReqTreeArr(trees: AnyTree[]) {
		return trees
			.filter((tree: AnyTree) => !!tree.sha);
	}

	private async buildTree(t: AnyTree): Promise<AnyTree[]> {
		const entries = Object.entries(t.tree as any);
		const dep = t.tree as AnyTree;

		const trees: AnyTree[] = [];

		for ( const [ key, tree ] of entries ) {
			const cur = dep[key] as any;
			if ( cur.type === 'tree' ) {
				cur.tree = await this.buildTree(cur) as any;

				const reqTree = this.getReqTreeArr(cur.tree as any);

				/*
				if ( cur.sha ) {
					const { data } = await this.rest.git.getTree({
						owner: this.user.userName,
						repo: this.repo.name,
						tree_sha: cur.sha,
					});
					const c = cur.tree as any;
					data.tree.forEach((tr: any) => {
						if ( Array.isArray(c) ) {
							if ( !c.find((v: any) => v.path === tr.path) ) {
								reqTree.push(tr);
							}
						} else {
							if ( c[tr.path] === undefined ) {
								reqTree.push(tr);
							}
						}
					});
				}
				*/

				const treeData = await this.tree(reqTree, cur.sha as string);
				const TD: AnyTree = {
					mode: '040000',
					type: 'tree',
					sha : treeData.sha,
					path: key,
				};
				trees.push(TD);
			} else if ( cur.type === 'blob' ) {
				const blob = await this.blob(key /* path */, cur);
				trees.push(blob);
			} else if ( cur.type === 'commit' ) {
				cur.path = key;
				cur.sha = cur.content;
				delete cur.content;
				delete cur.encoding;
				trees.push(cur);
			} else {
				throw Error('Unknown tree type');
			}
			await sleep(100);
		}

		return trees;
	}

	private async blob(p: string, file: Blob = {}): Promise<Blob> {
		if ( file.content ) {
			const { data } =  await this.rest.git.createBlob({
				owner: this.user.userName,
				repo: this.repo.name,
				content: file.content,
				encoding: file.encoding,
			});
			file.mode = '100644';
			file.sha = data.sha;
			file.path = p;
			delete file.content;
			return file;
		}

		// remove file
		return {
			path: p,
			mode: '100644',
			type: 'blob',
			sha: null,
		};
	}

	private async tree(tree: any[], base?: string) {
		const { data } = await this.rest.git.createTree({
			owner: this.user.userName,
			repo: this.repo.name,
			tree,
			base_tree: base,
		});
		return data;
	}

	private initTree() {
		this.curTree = {
			type: 'tree',
			mode: '160000',
			tree: {},
		};
	}

}

