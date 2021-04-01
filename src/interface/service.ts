/*
 * service.ts
 * Created on Wed Mar 31 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
 */

export interface Service {
	name: string;
	template: string;
}

export interface MetaData {
	title: string;
	href: string;
	updated: string;
	src: string;
	categories: any[]; //unknown
	tags: any[]; //unknown
}