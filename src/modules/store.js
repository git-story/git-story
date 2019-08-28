// Vuex Store
// 이곳에선 모든 페이지에서 공용으로 사용할 변수를 다룬다.

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		userToken: null,
		user: null 
	},
	getters: {
		token: state => {
			return state.userToken;
		},
		user: state => {
			return state.user;
		}
	},
	mutations: {
		login: (state, info) => {
			let token = info.credential.accessToken;
			let provider = info.user.providerData;

			state.user = provider["0"];
			state.userToken = token;
		}
	}
});
