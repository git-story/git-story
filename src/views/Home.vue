<template>
	<v-app>
		<Header/>

		<v-content>
			<v-btn @click="test">Hello</v-btn>
		</v-content>
	</v-app>
</template>

<script>
import Header from './Header.vue';

export default {
	name: 'App',
	components: {
		Header
	},
	methods: {
		test: function() {
			console.log(this.$store.getters.user.photoURL);
		}
	},
	data: () => ({
		//
	}),
};
</script>
