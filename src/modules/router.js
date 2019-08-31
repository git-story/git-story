// Router
// 페이지 라우팅 담당 파일

import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home'
import Test from '../views/Test'
import Test from '../views/Edit'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home
    },
    {
			path: '/Edit',
			name: 'Edit',
			component: Edit
		},
		{
			path: '/my-blog',
			name: 'MyBlog',
			component: MyBlog
		}
	]
})
