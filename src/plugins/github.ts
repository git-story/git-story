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
} from '@/interface/github';


export class Github {

	public repo!: Repository;

	private octokit: Octokit;
	private commitList: Blob[] = [];

	constructor(public user: User) {
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

	get rest() {
		return this.octokit.rest;
	}

	public async add(file: string, data: string, encoding: BlobEncoding = 'utf-8') {
		const blob: Blob = await this.blob(data, encoding);
		blob.type = 'blob';
		blob.mode = '100644';
		blob.path = file;
		delete blob.url;
		/* TODO: commitList add */
	}

	public async getRepo(repo: string) {
		return await this.rest.repos.get({
			owner: this.user.userName,
			repo,
		});
	}

	public async getTreeByRef(ref?: string, recursive: boolean = false): Promise<any> {
		const ret: TreeRef = { success: false };
		if ( !ref ) {
			ref = `heads/${this.repo.default_branch}`;
		}

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

			ret.tree = res.data.tree as Array<Tree<'blob'|'tree'>>;
			ret.sha = res.data.sha;
			ret.ref = obj.sha;
			ret.success = true;
		}
		return ret;
	}

	private async blob(data: string, encoding: BlobEncoding = 'utf-8'): Promise<Blob> {
		return await this.rest.git.createBlob({
			owner: this.user.userName,
			repo: this.repo.name,
			content: data,
			encoding,
		});
	}

}

