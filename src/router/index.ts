import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
	/*
	{
		path: 'register',
		component: () => import('views/Register/Register.vue'),
	},
	*/
	{
		path: 'posting/:href(.*)',
		component: () => import('views/Posting/Posting.vue'),
	},
	{
		path: 'dashboard',
		component: () => import('views/Dashboard/Dashboard.vue'),
		children: [
			{
				path: 'posts',
				component: () => import('views/Dashboard/DashboardPosts.vue'),
			},
			{
				path: 'category',
				component: () => import('views/Dashboard/DashboardCategory.vue'),
			},
			{
				path: 'config',
				component: () => import('views/Dashboard/DashboardConfig.vue'),
			},
			{
				path: 'theme',
				component: () => import('views/Dashboard/DashboardTheme.vue'),
			},
			{
				path: 'template',
				component: () => import('views/Dashboard/DashboardTemplate.vue'),
			},
			{
				path: 'comment',
				component: () => import('views/Dashboard/DashboardComment.vue'),
			},
			{
				path: 'setting',
				component: () => import('views/Dashboard/DashboardSetting.vue'),
			},
			{
				path: '',
				redirect: 'posts',
			},
		],
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/:lang',
			component: {
				template: '<router-view></router-view>',
			},
			children: [
				...routes,
				{
					path: '',
					component: () => import('views/Home/Home.vue'),
				},
			],
		},
		{
			path: '',
			redirect: '/' + navigator.language.split('-')[0],
		},
	],
});

export default router;
