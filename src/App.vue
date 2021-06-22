<!--
 * App.vue
 * Created on Mon Jul 13 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-app>
		<v-row class="d-md-none vh-100 ma-0" align="center">
			<v-col cols="12" align="center">
				<v-img max-height="200px" max-width="200px" :src="imgs.oops"></v-img>
				<p class="mt-4">{{ $t('block-mobile') }}</p>
			</v-col>
		</v-row>
		<div class="d-none d-md-block">
			<v-layout row justify-center>
				<v-dialog v-model="$store.getters.loading" persistent fullscreen content-class="loading-dialog">
					<v-container fill-height>
						<v-layout row justify-center align-center>
							<div align="center">
								<v-progress-circular
									indeterminate
									:size="70"
									:width="7"
									color="indigo">
								</v-progress-circular>
								<p class="mt-6 text-body blue--text text--lighten-5" style="font-size: 1.5rem;" v-html="$store.getters.loadmsg"></p>
							</div>
						</v-layout>
					</v-container>
				</v-dialog>
			</v-layout>
			<v-sheet id="router-view" tile>
				<transition name="scroll-y-reverse-transition">
					<router-view />
				</transition>
			</v-sheet>
		</div>
		<monaco-editor class="d-none" :options="{}" theme="vs" value="" />
	</v-app>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { User } from '@/interface/user';
import { Github } from '@/plugins/github';
import { Img } from '@/types/';

declare global {
	interface Window {
		monaco: any;
	}
}

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

	public imgs: Img = {
		oops: require('assets/oops.png'),
	};

	public created() {
		this.$logger.debug('app', 'App created');
		this.$git.progress((event: string, ...args: any[]) => {
			this.$store.commit('loadmsg',
				this.$t(`github.progress.${event}`, ...args));
		});

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
