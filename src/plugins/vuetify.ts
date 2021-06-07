/*
 * vuetify.ts
 * Created on Mon Jul 13 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
 */

import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { UserVuetifyPreset } from 'vuetify';
import local from './local';

import ko from '@/languages/ko/';
import en from '@/languages/en/';

Vue.use(Vuetify);

let lang = local.read<string>('language');
if ( !lang ) {
	lang = navigator.language.split('-')[0];
}

export default new Vuetify({
	lang: {
		locales: { ko, en },
		current: lang,
	},
} as UserVuetifyPreset);
