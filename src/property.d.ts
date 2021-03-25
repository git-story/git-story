/*
 * This file is definition interface of Vue.
 */
import Vue from 'vue';
import { Session } from './plugins/session';

declare module 'vue/types/vue' {
	interface Vue {
		$session: Session;
	}
}
