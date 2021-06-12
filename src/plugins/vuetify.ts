/*
 * vuetify.ts
 * Created on Mon Jul 13 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
 */

import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { UserVuetifyPreset } from 'vuetify';
import colors from 'vuetify/lib/util/colors';
import local from './local';

import ko from '@/languages/ko/';
import en from '@/languages/en/';

Vue.use(Vuetify);

let lang = local.read<string>('language');
if ( !lang ) {
	lang = navigator.language.split('-')[0];
}

export const locales = {
	en,
	ko,
};

export default new Vuetify({
	lang: {
		locales,
		current: lang,
	},
	theme: {
		themes: {
			dark: {
				black: '#e8e8e8',
				indigo: {
					darken1: colors.indigo.lighten1,
					darken2: colors.indigo.lighten2,
					darken3: colors.indigo.lighten3,
					darken4: colors.indigo.lighten4,
					lighten1: colors.indigo.darken1,
					lighten2: colors.indigo.darken2,
					lighten3: colors.indigo.darken3,
					lighten4: colors.indigo.darken4,
					lighten5: '#2a2d4f',
				},
				green: {
					darken1: colors.green.lighten1,
					darken2: colors.green.lighten2,
					darken3: colors.green.lighten3,
					darken4: colors.green.lighten4,
				},
				grey: {
					darken1: colors.grey.lighten1,
					darken2: colors.grey.lighten2,
					darken3: colors.grey.lighten3,
					darken4: colors.grey.lighten4,
					darken5: '#000',
					lighten1: colors.grey.darken1,
					lighten2: colors.grey.darken2,
					lighten3: colors.grey.darken3,
					lighten4: colors.grey.darken4,
				},
				teal: {
					darken3: colors.teal.lighten3,
				},
				white: '#262626',
			},
		},
	},
} as UserVuetifyPreset);
