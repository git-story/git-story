// Router
// 페이지 라우팅 담당 파일

import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home'
import MyBlog from '../views/MyBlog'
import Edit from '../views/Edit'

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
      path: '/my-blog',
			name: 'MyBlog',
			component: MyBlog
		},
    {
      path: '/edit',
      name: 'Edit',
      component: Edit
    }
	]
})
