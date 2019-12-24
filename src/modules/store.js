// Vuex Store
// 이곳에선 모든 페이지에서 공용으로 사용할 변수를 다룬다.

import Vue from 'vue'
import Vuex from 'vuex'
import config from '../config'
import GitHubAPI from './github-api.js'

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
		vMobile: false, // mobile view flag
		api: null,
		tasking: false,
	},
	getters: {
		token: state => state.userToken,
		user: state => state.user,
		github: state => state.github,
		config: state => state.config,
		vMobile: state => state.vMobile,
		api: state => state.api,
		task: state => state.tasking,
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
		vMobile: (state, mode) => {
			state.vMobile = mode;
		},
		api: (state) => {
			let GitHub = new GitHubAPI({token: state.userToken});
			let name = state.user.name;

			state.api = new Object();
			state.api.git = GitHub;
			state.api.repo = GitHub.getRepository(`${name}/${name}.github.io`);
			state.api.user = GitHub.getUser(name);
		},
		task: (state, set) => {
			state.tasking = set;
		}
	}
});
