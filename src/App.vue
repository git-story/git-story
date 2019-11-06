<template>
	<v-app width="100vh">
		<Header v-if="!isHome"/>
		<HeaderHome v-if="isHome"/>
		<HeaderElevate v-if="isHome"/>

		<v-sheet id="router-view" class="overflow-y-auto" tile max-height="100vh">
			<router-view/>
		</v-sheet>
	</v-app>
</template>
<style>
html {
	overflow-y: hidden !important;
}
div.row {
	width: 100%;
}
div.v-sheet main.v-content {
	height: 100vh;
}
</style>
<script>
import HeaderComponent from './views/Com/Header';
import HeaderElevate from './views/Com/HeaderElevate';
import HeaderHome from './views/Com/HeaderHome';
import BlogSideBar from './views/MyBlog/BlogSideBar';

export default {
	name: 'App',
	components: {
		Header: HeaderComponent,
		HeaderElevate,
		HeaderHome,
		BlogSideBar
	},
	data: function() {
		return {
			isHome: (this.$route.name === "Home")
		}
	}
};
</script>
