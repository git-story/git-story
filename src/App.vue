<template>
	<v-app width="100%">
		<Header />

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
import HeaderComponent from '@/views/Com/Header';

export default {
	name: 'App',
	components: {
		Header: HeaderComponent,
	},
    mounted() {
    },
	data: function() {
		return {
			isHome: (this.$route.name === "Home")
		}
	}
};
</script>
