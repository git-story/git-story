// App Init
import App from './App.vue'
import Vue from 'vue'
import vuetify from './plugins/vuetify';

// 직접 사용하는 모듈
import router from './modules/router.js'
import store from './modules/store.js'
import { Vueditorkorean } from './modules/editorLanguage'

import Vueditor from 'vueditor_custom'
import 'vueditor_custom/dist/style/vueditor.min.css'


let config = {
	spellcheck: false,
	toolbar: [
		'removeFormat', 'undo', 'redo', '|', 'code', 'element', 'fontName', 'fontSize', 'foreColor', 'backColor', 'divider', 'bold', 'italic', 'underline', 'strikeThrough',
		'link', 'unLink', 'divider', 'subscript', 'superscript', 'divider', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
		'|', 'indent', 'outdent', 'insertOrderedList', 'insertUnorderedList', '|', 'emoji', 'picture', 'table', '|', 'sourceCode', 'markdown'
	],
	lang: Vueditorkorean,
	fontName: [
		{val: 'arial black'}, 
		{val: 'times new roman'}, 
		{val: 'Courier New'}
	],
	fontSize: ['12px', '14px', '16px', '18px', '0.8rem', '1.0rem', '1.2rem', '1.5rem', '2.0rem'],
	uploadUrl: ''
};

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

Vue.use(Vueditor, config);

Vue.config.productionTip = false
new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app');
