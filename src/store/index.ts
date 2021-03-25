import Vue from 'vue';
import Vuex from 'vuex';

import { User } from '@/interface/user';

Vue.use(Vuex);

interface State {
	user?: User;
}

export default new Vuex.Store({
	state: {
		user: undefined,
	},
	getters: {
		user(state: State) {
			return state.user;
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
