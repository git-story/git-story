/*
 * github.ts
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
 */

import { Octokit } from '@octokit/rest';
import logger from './logger';

export type BlobEncoding = 'utf-8'|'base64';

export interface User {
	displayName?: string;
	accessToken: string;
	photoURL: string;
	email: string;
	userName: string;
}


export interface Tree<T> {
	sha?: null|string;
	url?: string;
	type?: T;
	mode?: string;
	path?: string;
}

export interface Blob extends Tree<'blob'> {
	size?: number;
}

export interface Permission {
	admin: boolean;
	push: boolean;
	pull: boolean;
}

export interface Owner {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	type: string;
	site_admin: boolean;
}

export interface Repository {
    id: number,
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: Owner;
    html_url: string;
    description: null|string;
    fork: boolean;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    homepage: null|string;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: null|string;
    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    forks_count: number;
    mirror_url: null|string;
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;
    license: null|string;
    forks: number;
    open_issues: number;
    watchers: number;
    default_branch: string;
    permissions: Permission;
    temp_clone_token: string;
    allow_squash_merge: boolean;
    allow_merge_commit: boolean;
    allow_rebase_merge: boolean;
    delete_branch_on_merge: boolean;
    network_count: number;
    subscribers_count: number;
}

export interface TreeRef {
	tree?: Tree<'blob'|'tree'>[];
	ref?: string;
	sha?: string;
	success: boolean;
}

export class Github {
	private octokit: Octokit;
	private commitList: Blob[] = [];

	public repo!: Repository;

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

	private async blob(data: string, encoding: BlobEncoding = 'utf-8'): Promise<Blob> {
		return await this.rest.git.createBlob({
			owner: this.user.userName,
			repo: this.repo.name,
			content: data,
			encoding,
		});
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

		const { data } = await this.rest.git.getRef({
			owner: this.user.userName,
			repo: this.repo.name,
			ref,
		});

		const obj = data.object;
		if ( obj.type === 'commit' ) {
			const { data } = await this.rest.git.getCommit({
				owner: this.user.userName,
				repo: this.repo.name,
				commit_sha: obj.sha,
			});

			const res = await this.rest.git.getTree({
				owner: this.user.userName,
				repo: this.repo.name,
				tree_sha: data.sha,
				recursive: recursive.toString(),
			});

			ret.tree = res.data.tree as Tree<'blob'|'tree'>[];
			ret.sha = res.data.sha;
			ret.ref = obj.sha;
			ret.success = true;
		}
		return ret;
	}

}

