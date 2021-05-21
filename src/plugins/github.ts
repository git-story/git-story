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
} from '@/interface/github';


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

	public async getContent<T extends object>(args: any, type: 'json'|'string' = 'string'): Promise<void|T> {
		let ret: any;
		try {
			const res = await this.rest.repos.getContent(args);
			const data = res.data as GitContent;
			switch ( data.encoding ) {
				case 'base64':
					ret = Buffer.from(data.content, 'base64').toString('utf8');
					break;
				default:
					ret = data.content;
			}

			switch ( type ) {
				case 'json':
					ret = JSON.parse(ret) as T;
					break;
			}
		} catch (err) {
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
					'type': 'tree',
					'mode': '160000',
					'tree': {},
				};
				const org = this.repoTree.tree.find((d: AnyTree) => d.path === cur);
				if ( org ) {
					dep[p]['sha'] = org.sha;
				}
			}
			dep = dep[p]['tree'] as AnyTree;
		}

		dep[file] = {
			'type': 'blob',
			'mode': '100644',
			'content': data,
			encoding,
		} as Blob;
	}

	public async commit(message: string) {
		console.log(JSON.stringify(this.curTree, null, '\t'));
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

	private async buildTree(tree: AnyTree): Promise<AnyTree[]> {
		const entries = Object.entries(tree.tree as any);
		let dep = tree.tree as AnyTree;

		const trees: AnyTree[] = [];


		for ( const [ key, tree ] of entries ) {
			const cur = dep[key] as AnyTree;
			if ( cur.type === 'tree' ) {
				cur.tree = await this.buildTree(cur) as any;

				const reqTree = this.getReqTreeArr(cur.tree as any);

				if ( cur.sha ) {
					const { data } = await this.rest.git.getTree({
						owner: this.user.userName,
						repo: this.repo.name,
						tree_sha: cur.sha
					});
					data.tree.forEach((tree: any) => {
						const c = cur.tree as any;
						if ( c[tree.path] === undefined ) {
							reqTree.push(tree);
						}
					});
				}

				const treeData = await this.tree(reqTree);
				const TD: AnyTree = {
					'mode': '040000',
					'type': 'tree',
					'sha' : treeData.sha,
					'path': key,
				};
				trees.push(TD);
			} else if ( cur.type === 'blob' ) {
				const blob = await this.blob(cur, key /* path */);
				trees.push(blob);
			} else {
				throw Error('Unknown tree type');
			}
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

	private async blob(file: Blob, p: string): Promise<Blob> {
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

	private async tree(tree: any[]) {
		const { data } = await this.rest.git.createTree({
			owner: this.user.userName,
			repo: this.repo.name,
			tree,
		});
		return data;
	}

	private initTree() {
		this.curTree = {
			'type': 'tree',
			'mode': '160000',
			'tree': {},
		};
	}

}

