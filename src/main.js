// App Init
import App from './App.vue'
import Vue from 'vue'
import vuetify from './plugins/vuetify';

// 직접 사용하는 모듈
import router from './modules/router.js'
import store from './modules/store.js'

import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';


// firebase 초기화
// firebase 모듈 전체를 임포트 하는 것 보다 사용할 함수만 로드하는 게 더 빠르다.
import { initializeApp } from 'firebase'
const firebaseConfig = {
	apiKey: "AIzaSyBIVdGNPNlxKstifz7VwaFwqP8taC5C1Ks",
	authDomain: "git-page-story.firebaseapp.com",
	databaseURL: "https://git-page-story.firebaseio.com",
	projectId: "git-page-story",
	storageBucket: "",
	messagingSenderId: "324500603189",
	appId: "1:324500603189:web:b1eca3949685442e"
};
initializeApp(firebaseConfig);

Vue.config.productionTip = false
new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app');
