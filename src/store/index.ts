import Vue from 'vue';
import Vuex from 'vuex';

import { User } from '@/interface/user';
import { Service } from '@/interface/service';

Vue.use(Vuex);

interface State {
	user?: User;
	service: Service;
}

export default new Vuex.Store({
	state: {
		user: undefined,
		service: {
			name: 'git-story',
			template: 'git-story-template',
		},
	},
	getters: {
		user(state: State) {
			return state.user;
		},
		service(state: State) {
			return state.service;
		},
	},
	mutations: {
		setUser(state: State, user: User) {
			state.user = user;
		},
	},
	actions: {
	},
	modules: {
	},
});
