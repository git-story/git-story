/*
 * This file is definition interface of Vue.
 */
import Vue from 'vue';
import { Session } from './plugins/session';
import { Logger } from './plugins/logger';
import { Github } from './plugins/github';

declare module 'vue/types/vue' {
	interface Vue {
		$session: Session;
		$logger: Logger;
		$git: Github;
	}
}
