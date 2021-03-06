/*
 * main.ts
 * Created on Tue Aug 04 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
 */

import Vue from 'vue';
import App from '@/App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import firebase from 'firebase';
import axios from 'axios';

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
Vue.prototype.$firebase = firebase;
Vue.prototype.$axios = axios;

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount('#app');

