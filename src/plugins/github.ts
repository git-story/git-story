import { Octokit } from '@octokit/rest';
import path from 'path';
import yaml from 'js-yaml';
import * as submodule from 'git-submodule-js';
import logger from './logger';

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
} from '../interface/github';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
	private Q: any = [];

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

	get isAdded() {
		return Object.keys(this.curTree.tree as any).length > 0;
	}

	public setUser(user: any) {
		this.user = user;
		this.octokit = new Octokit({
			auth: user.accessToken,
			log: {
				debug: logger.debug,
				info: logger.info,
				warn: logger.warn,
				error: logger.error,
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
		const blob: AnyTree = {
			content: data,
			encoding,
		};

		if ( encoding === 'link' ) {
			(blob as Tree<'commit'>).type = 'commit';
			blob.mode = '160000';
		} else {
			blob.type = 'blob';
			blob.mode = '100644';
		}

		this.dispatch(file, blob);
	}

	public remove(file: string) {
		const tree: any = this.repoTree.tree as any;
		const idx = tree.findIndex((t: any) => t.path === file);
		if ( idx === -1 ) {
			return;
		}

		const result = tree[idx];
		switch ( result.type ) {
			case 'blob':
				this.dispatch(file, {
					type: 'blob',
				});
			break;
			case 'tree':
				const regex = new RegExp(`^${file}/`);
				for ( const t of tree ) {
					const tp = t.path as string;
					if ( tp === file || tp.match(regex) ) {
						if ( t.type === 'blob' ) {
							this.dispatch(file, {
								type: 'blob',
							});
						}
					}
				}
				break;
		}
	}

	public update(file: string, data: string, encoding: BlobEncoding = 'utf-8') {
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

		this.dispatch(file, blob);
	}

	public async commit(message: string) {
		const treeData = this.repoTree;
		const treeObj = treeData.tree as any;

		if ( !this.isAdded ) {
			// Don't need new commit because not change anything.
			return;
		}

		// overwrite don't modify file in root directory(tree)
		const build = await this.buildTree(this.curTree);
		if ( build ) {
			const rootTree = await this.rest.git.getTree({
				owner: this.user.userName,
				repo: this.repo.name,
				tree_sha: treeData.sha,
			});
			rootTree.data.tree.forEach((tr: any) => {
				if ( !build.find((v: any) => v.path === tr.path) ) {
					build.push(tr);
				}
			});
		}

		const newTree = await this.tree(build);
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
		this.Q = [];
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

	public async getTreeByRef(repo: string = '', refrence?: string, recursive: boolean = false): Promise<any> {
		const [ user, name ] = repo.split('/');
		const ret: TreeRef = { success: false };

		let ref = refrence as string;
		let default_branch = this.repo.default_branch;
		if ( !ref ) {
			ref = `heads/${default_branch}`;
		}
		this.refStr = ref;

		if ( user && name ) {
			const { data } = await this.rest.repos.get({
				owner: user,
				repo: name,
			});
			default_branch = data.default_branch;
		}

		if ( !refrence ) {
			ref = `heads/${default_branch}`;
		}

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

	private getReqTreeArr(trees: AnyTree[]) {
		return trees
		.filter((tree: AnyTree) => !!tree.sha);
	}

	private async buildTree(t: AnyTree, dirname: string = ''): Promise<AnyTree[]> {
		const entries = Object.entries(t.tree as any);
		const dep = t.tree as AnyTree;

		const trees: AnyTree[] = [];

		for ( const [ key, tree ] of entries ) {
			const cur = dep[key] as any;
			const fullPath = path.join(dirname, key);

			if ( cur.type === 'tree' ) {
				cur.tree = await this.buildTree(cur, path.join(dirname, key)) as any;

				let reqTree: any = cur.tree as any;

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

				reqTree = this.getReqTreeArr(reqTree);

				const treeData = await this.tree(reqTree);

				const TD: AnyTree = {
					mode: '040000',
					type: 'tree',
					sha : treeData.sha,
					path: key,
				};
				trees.push(TD);
			} else if ( cur.type === 'blob' ) {
				const blob = await this.blob(key /* path */, cur);
				if ( blob.sha === null ) {
					// remove file at original tree
					const item = this.find(fullPath);
					if ( item ) {
						item.sha = null;
					}
				}
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
		this.Q = [];
	}

	private dispatch(file: string, blob: Blob = {}) {
		let dep = this.curTree.tree as AnyTree;

		let stack: string[] = [];
		if ( path.dirname(file) !== '.' ) {
			stack = path.dirname(file).split('/');
		}
		file = path.basename(file);

		// tree dig
		let cur = '';
		for ( const p of stack ) {
			cur = path.join(cur, p);
			if ( !dep[p] ) {
				dep[p] = {
					type: 'tree',
					mode: '160000',
					tree: {},
				};

				// When exists directory(tree).
				const org = this.repoTree.tree.find((d: AnyTree) => d.path === cur);
				if ( org ) {
					dep[p].sha = org.sha;
				}
			}
			dep = dep[p].tree as AnyTree;
		}

		dep[file] = blob;
	}

	private find(p: string) {
		return this.repoTree.tree.find((t: any) => t.path === p);
	}

}
