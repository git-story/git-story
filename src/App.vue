<!--
 * App.vue
 * Created on Mon Jul 13 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-app>
		<v-layout row justify-center>
			<v-dialog v-model="$store.getters.loading" persistent fullscreen content-class="loading-dialog">
				<v-container fill-height>
					<v-layout row justify-center align-center>
						<v-progress-circular
		  					indeterminate
		  					:size="70"
		  					:width="7"
							color="indigo">
						</v-progress-circular>
					</v-layout>
				</v-container>
			</v-dialog>
		</v-layout>
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
import { Github } from '@git-story/github-plugin';

@Component({
	watch: {
		$route(to, from) {
			this.$logger.info('route', `Change route ${from.path} to ${to.path}.`);

			if ( !this.$store.getters.user ) {
				if ( to.path.replace(/^\/../, '') ) {
					const t = this as any;
					t.$assign('/');
					return;
				}
			}

			if ( to.params.lang ) {
				if ( this.$vuetify.lang.current !== to.params.lang ) {
					this.$vuetify.lang.current = to.params.lang;
				}
			}
		},
	},
})
export default class App extends Mixins(GlobalMixins) {

	public created() {
		this.$logger.debug('app', 'App created');

		this.$store.watch(() => this.$store.getters.user, async (u: User) => {
			this.$git.setUser(u);
			await this.$git.initRepo(`${u.userName}.github.io`);
			this.$logger.debug('github', 'Octokit login', this.$git);
		});

		const user = this.$session.read<User>('userInfo', JSON.parse);
		if ( user ) {
			this.$logger.info('app', 'Has login user info.', user);
			this.$store.commit('setUser', user);
			window.addEventListener('load', () => {
				this.$logger.info('router', 'Now router', this.$route);
				if ( this.$route.path.match(/^\/..$/) ) {
					this.$assign('/dashboard');
				}
			});
		}
	}

}
</script>
<style scope>
.loading-dialog {
	background-color: rgba(48, 48, 48, 0.5);
}
</style>
