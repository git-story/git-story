// Vuex Store
// 이곳에선 모든 페이지에서 공용으로 사용할 변수를 다룬다.

import Vue from 'vue'
import Vuex from 'vuex'
import config from '../config'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		userToken: null,
		user: null ,
		github: null,
		config: config,
		postMode: '',
	},
	getters: {
		token: state => {
			return state.userToken;
		},
		user: state => {
			return state.user;
		},
		github: state => {
			return state.github;
		},
		config: state => {
			return state.config;
		},
		postMode: state => {
			return state.postMode;
		}
	},
	mutations: {
		login: (state, info) => {
			let token = info.credential.accessToken;
			let provider = info.user.providerData;
			let userInfo = info.additionalUserInfo;
			let html_url = userInfo.profile.html_url;
			let name = userInfo.username;

			state.user = provider["0"];
			state.user.name = name;
			state.userToken = token;
			state.github = html_url;
		},
		logout: (state) => {
			state.userToken = null;
			state.user = null;
			state.github = null;
		},
		postMode: (state, mode) => {
			state.postMode = mode;
		}
	}
});
