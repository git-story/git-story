<!--
 * App.vue
 * Created on Mon Jul 13 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-app>
		<v-sheet id="router-view" tile>
			<transition name="scroll-y-reverse-transition">
				<router-view />
			</transition>
		</v-sheet>
	</v-app>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { User } from '@/interface/user';

@Component
export default class App extends Mixins(GlobalMixins) {

	public created() {
		this.$logger.debug('app', 'App created');
		const user = this.$session.read<User>('userInfo', JSON.parse);
		if ( user ) {
			this.$logger.info('app', 'Has login user info.', user);
			this.$store.commit('setUser', user);
			if ( this.$route.path === '/' ) {
				this.$assign('/dashboard');
			}
		}
	}

}
</script>
