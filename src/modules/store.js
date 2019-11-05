// Vuex Store
// 이곳에선 모든 페이지에서 공용으로 사용할 변수를 다룬다.

import Vue from 'vue'
import Vuex from 'vuex'
import config from '../config'

Vue.use(Vuex);


var prepareUser = null;
var prepareToken = sessionStorage.getItem('token');

let s_user = sessionStorage.getItem('user');
if ( s_user ) {
	prepareUser = JSON.parse(s_user);
}

export default new Vuex.Store({
	state: {
		userToken: prepareToken,
		user: prepareUser,
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

			let userInfoStr = JSON.stringify(state.user);
			sessionStorage.setItem("token", token);
			sessionStorage.setItem("user", userInfoStr);
		},
		logout: (state) => {
			state.userToken = null;
			state.user = null;
			state.github = null;
			sessionStorage.clear();
		},
		postMode: (state, mode) => {
			state.postMode = mode;
		}
	}
});
