import Vue from 'vue'
import vuetify from './plugins/vuetify';

// 직접 사용하는 모듈
import router from './modules/router.js'
import store from './modules/store.js'

// 가장 처음 보일 Home 페이지
import Home from './views/Home.vue'


// firebase 초기화
import firebase from 'firebase'
const firebaseConfig = {
	apiKey: "AIzaSyBIVdGNPNlxKstifz7VwaFwqP8taC5C1Ks",
	authDomain: "git-page-story.firebaseapp.com",
	databaseURL: "https://git-page-story.firebaseio.com",
	projectId: "git-page-story",
	storageBucket: "",
	messagingSenderId: "324500603189",
	appId: "1:324500603189:web:b1eca3949685442e"
};
firebase.initializeApp(firebaseConfig);


Vue.config.productionTip = false
new Vue({
	el: '#app',
	router,
	store,
	vuetify,
	render: h => h(Home)
});
