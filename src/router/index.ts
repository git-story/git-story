import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
	{
		path: '/',
		component: () => import('views/Home/Home.vue'),
	},
	{
		path: '/register',
		component: () => import('views/Register/Register.vue'),
	},
	{
		path: '/dashboard',
		redirect: '/dashboard/posts',
	},
	{
		path: '/posting/:href(.*)',
		component: () => import('views/Posting/Posting.vue'),
	},
	{
		path: '/dashboard/:selected(.*)',
		component: () => import('views/Dashboard/Dashboard.vue'),
		children: [
			{
				path: '/dashboard/posts',
				component: () => import('views/Dashboard/DashboardPosts.vue'),
			},
			{
				path: '/dashboard/category',
				component: () => import('views/Dashboard/DashboardCategory.vue'),
			},
			{
				path: '/dashboard/config',
				component: () => import('views/Dashboard/DashboardConfig.vue'),
			},
			{
				path: '/dashboard/theme',
				component: () => import('views/Dashboard/DashboardTheme.vue'),
			},
			{
				path: '/dashboard/template',
				component: () => import('views/Dashboard/DashboardTemplate.vue'),
			},
			{
				path: '/dashboard/comment',
				component: () => import('views/Dashboard/DashboardComment.vue'),
			},
			{
				path: '/dashboard/setting',
				component: () => import('views/Dashboard/DashboardSetting.vue'),
			},
			{
				path: '',
				redirect: '/dashboard/posts',
			},
		],
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
