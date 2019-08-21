import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

import firebase from 'firebase'

Vue.config.productionTip = false

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

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
