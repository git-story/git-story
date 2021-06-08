/*
 * This file is definition interface of Vue.
 */
import Vue from 'vue';
import { Session } from './plugins/session';
import { Local } from './plugins/local';
import { Logger } from './plugins/logger';
import { Github } from '@git-story/github-plugin';
import { AxiosStatic } from 'axios';
import { Firebase } from './plugins/firebase';

declare module 'vue/types/vue' {
	interface Vue {
		$session: Session;
		$local: Local;
		$logger: Logger;
		$git: Github;
		$evt: Vue;
		$axios: AxiosStatic;
		$firebase: Firebase;
	}
}
