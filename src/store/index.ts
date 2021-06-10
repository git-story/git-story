import Vue from 'vue';
import Vuex from 'vuex';

import { User } from '@/interface/user';
import { Service } from '@/interface/service';

Vue.use(Vuex);

interface State {
	user?: User;
	service: Service;
	markdown: string;
	title: string;
	loading: boolean;
	loadmsg: string;
}

export default new Vuex.Store({
	state: {
		user: undefined,
		service: {
			name: 'git-story',
			template: 'git-story-template',
		},
		markdown: '',
		title: '',
		loading: false,
		loadmsg: '',
	},
	getters: {
		user(state: State) {
			return state.user;
		},
		service(state: State) {
			return state.service;
		},
		markdown(state: State) {
			return state.markdown;
		},
		title(state: State) {
			return state.title;
		},
		loading(state: State) {
			return state.loading;
		},
		loadmsg(state: State) {
			return state.loadmsg;
		},
	},
	mutations: {
		setUser(state: State, user: User) {
			state.user = user;
		},
		markdown(state: State, md: string) {
			state.markdown = md;
		},
		title(state: State, t: string) {
			state.title = t;
		},
		loading(state: State, v: boolean) {
			state.loading = v;
		},
		loadmsg(state: State, msg: string) {
			state.loadmsg = msg;
		},
	},
	actions: {
	},
	modules: {
	},
});
