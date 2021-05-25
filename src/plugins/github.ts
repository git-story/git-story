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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class Github {

	public repo!: Repository;

	private octokit!: Octokit;
	private commitList: Blob[] = [];
	private user!: User;

	private repoTree!: {
		tree: AnyTree[],
		sha: string,
		ref: string,
	};
	private curTree: Tree<'tree'> = {};
	private refStr: string = '';

	constructor(user?: User) {
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

	public setUser(user: User) {
		this.user = user;
		this.octokit = new Octokit({
			auth: user.accessToken,
			log: {
				debug: (...args: any[]) => logger.debug('github', ...args),
				info:  (...args: any[]) => logger.info('github', ...args),
				warn:  (...args: any[]) => logger.warn('github', ...args),
				error: (...args: any[]) => logger.error('github', ...args),
			},
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

	public async getContent<T extends object>(p: string, type: ContentType = 'utf8', repo?: string): Promise<void|T> {
		let ret: any;
		try {
			const res = await this.rest.repos.getContent({
				owner: this.user.userName,
				repo: repo || this.repo.name,
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
			}
		} catch (err) {
			// empty
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
			type: 'blob',
			mode: '100644',
			content: data,
			encoding,
		} as Blob;
	}

	public async remove(paths: string[], message: string) {
		const trees: AnyTree[] = [];
		for ( const p of paths ) {
			const result = this.repoTree.tree.find((t: any) => t.path === p);
			if ( !result ) {
				continue;
			}

			switch ( result.type ) {
				case 'blob':
					trees.push(await this.blob(p));
					break;
				case 'tree':
					const regex = new RegExp(`^${p}`);
					for ( const t of this.repoTree.tree ) {
						const tp = t.path as string;
						if ( t.type === 'blob' && tp.match(regex) ) {
							trees.push(await this.blob(tp));
						}
					}
					break;
			}
		}
		const newTree = await this.tree(trees, this.repoTree.sha);
		await this.treeCommit(newTree, message);
	}

	/*
	   {
	   		path: string
			blob: Blob {
				content: string
				encoding: string
			}
	   }
	*/
	public async update(files: any[], message: string) {
		const trees: AnyTree[] = [];
		for ( const file of files ) {
			const result = this.repoTree.tree.find((t: any) => t.path === file.path);
			if ( !result ) {
				continue;
			}

			const { blob } = file;
			blob.type = 'blob';
			blob.mode = '100644';
			trees.push(await this.blob(file.path, blob));
		}
		const newTree = await this.tree(trees, this.repoTree.sha);
		await this.treeCommit(newTree, message);
	}

	public async commit(message: string) {
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

		const newTree = await this.tree(treeObj);
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
			const cur = dep[key] as AnyTree;
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
			} else {
				throw Error('Unknown tree type');
			}
			await sleep(100);
		}

		return trees;
	}

	private async getTreeByRef(ref?: string, recursive: boolean = false): Promise<any> {
		const ret: TreeRef = { success: false };
		if ( !ref ) {
			ref = `heads/${this.repo.default_branch}`;
		}
		this.refStr = ref;

		let res: any = await this.rest.git.getRef({
			owner: this.user.userName,
			repo: this.repo.name,
			ref,
		});

		const obj = res.data.object;
		if ( obj.type === 'commit' ) {
			res = await this.rest.git.getCommit({
				owner: this.user.userName,
				repo: this.repo.name,
				commit_sha: obj.sha,
			});

			res = await this.rest.git.getTree({
				owner: this.user.userName,
				repo: this.repo.name,
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

