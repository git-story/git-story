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
		component: () => import('views/Dashboard/Dashboard.vue'),
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
