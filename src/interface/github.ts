/*
 * github.ts
 * Created on Mon Mar 29 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
 */

export type BlobEncoding = 'utf-8'|'base64';

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
	id: number;
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
	tree?: Array<Tree<'blob'|'tree'>>;
	ref?: string;
	sha?: string;
	success: boolean;
}
