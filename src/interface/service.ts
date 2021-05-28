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
	date: string;
	updated: string;
	src: string;
	categories: string[];
	tags: string[];
}

export interface ImgData {
	text: string;
	type: string;
}

export interface TempPostImage {
	id: string;
	name: string;
	line: number;
	data: ImgData;
}

export interface TempPost {
	title: string;
	content: string;
	updated: string;
	imgs: TempPostImage[];
}

// https://hexo.io/docs/front-matter.html#Settings-amp-Their-Default-Values
export interface PostConfig {
	layout?: string;
	title?: string;
	date?: string;
	updated?: string;
	comments?: boolean;
	tags?: string[];
	categories?: string[];
	permalink?: string;
	cover?: string;
	uploadType: 'github'|'base64'|'imgur';
}

export interface DataTree {
	text: string;
	children: DataTree[];
}

export interface Theme {
	name: string;
	description: string;
	link: string;
	preview: string;
	tags: string[];
	thumbnail: string;
}
