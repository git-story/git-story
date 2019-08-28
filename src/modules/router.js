// Router
// 페이지 라우팅 담당 파일

import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home.vue'
import Text from '../views/Test.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/test',
			name: 'test',
			component: Text
		}
	]
})
