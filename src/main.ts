/*
 * main.ts
 * Created on Tue Aug 04 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
 */

import Vue from 'vue';
import VueMeta from 'vue-meta';
import App from '@/App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import 'vue-calendar-heatmap/dist/vue-calendar-heatmap.css';
import './main.css';

import firebase from 'firebase';
import axios from 'axios';

import session from './plugins/session';
import local from './plugins/local';
import logger from './plugins/logger';
import { Firebase } from './plugins/firebase';
import { Github } from './plugins/github';

import ThemeToggleBtn from './Components/ThemeToggleBtn.vue';
import AvatarBtn from './Components/AvatarBtn.vue';

import LiquorTree from 'liquor-tree';
import MonacoEditor from 'vue-monaco';

Vue.config.productionTip = false;

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBDhMOhrR2IDgwcve1iT8oP9cunofuydtY',
	authDomain: 'api-git-story.firebaseapp.com',
	databaseURL: 'https://api-git-story.firebaseio.com',
	projectId: 'api-git-story',
	storageBucket: 'api-git-story.appspot.com',
	messagingSenderId: '340730769425',
	appId: '1:340730769425:web:3ff259b1dbc3713909c1b0',
	measurementId: 'G-85DPT7JZDM',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

Vue.prototype.$axios = axios;
Vue.prototype.$evt = new Vue();
Vue.prototype.$git = new Github();
Vue.prototype.$firebase = new Firebase(firebase, 'http://localhost:5001/api-git-story/us-central1');

Vue.use(session);
Vue.use(local);
Vue.use(logger);
Vue.use(LiquorTree);
Vue.use(VueMeta, {
	refreshOnceOnNavigation: true,
});

Vue.component('theme-toggle-btn', ThemeToggleBtn);
Vue.component('avatar-btn', AvatarBtn);
Vue.component('monaco-editor', MonacoEditor);

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount('#app');

