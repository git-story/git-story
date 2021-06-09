export type BlobEncoding = 'utf-8'|'base64'|'link';
export type AnyTree = Blob|Tree<'tree'>|Tree<'commit'>;
export type ContentType = 'json'|'utf8'|'yaml'|'base64'|'submodule';

export interface Tree<T> {
	sha?: null|string;
	url?: string;
	type?: T;
	mode?: string;
	path?: string;
	tree?: {
		[key: string]: AnyTree;
	};
}

export interface Blob extends Tree<'blob'> {
	size?: number;
	content?: string;
	encoding?: string;
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
	tree?: AnyTree[];
	ref?: string;
	sha?: string;
	success: boolean;
}

export interface GitContent {
	name: string;
	path: string;
	sha: string;
	size: number;
	type: string;
	content: string;
	encoding: string;
}
