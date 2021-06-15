<!--
 * HomeBanner.vue
 * Created on Wed Jul 15 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-img dark :src="imgs.loginBanner" class="login-banner" height="600px" style="background-size: contain;">
		<HomeHeader />
		<v-row align="center" style="height:536px" class="ma-0">
			<v-col cols="0" sm="1" md="2"></v-col>
			<v-col cols="0" sm="10" md="8" align="center" class="px-12">
				<v-row align="center">
					<v-col cols="12" md="7" align="left" style="height: unset;">
						<h1 class="display-1 blue--text text--lighten-4 font-weight-bold">
							{{ $t('home.login.baner') }}
						</h1>
						<p class="mt-12 grey--text text--lighten-5" style="word-break: keep-all;" v-html="$t('home.login.desc')"></p>
					</v-col>
					<v-col cols="12" md="5" align="right" style="height: unset;" align-self="end">
						<v-btn
							text
							tile
							x-large
							@click="githubLogin"
							color="blue lighten-2">
							{{ $t('home.login.sign-in') }}
						</v-btn>
					</v-col>
				</v-row>
			</v-col>
			<v-col cols="0" sm="1" md="2"></v-col>
		</v-row>
	</v-img>
</template>
<style scope>
div.v-image.login-banner div.v-responsive__content {
    background: rgba(0, 0, 0, 0.8);
}
div.row {
    width: 100%;
    margin-right:unset;
}
div.v-image.login-banner .v-image__image.v-image__image--cover {
    background-size: cover;
}
</style>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Imgs } from 'types/index';
import HomeHeader from './HomeHeader.vue';
import firebase from 'firebase';
import { User } from '@/interface/user';

@Component({
	components: {
		HomeHeader,
	},
})
export default class HomeBanner extends Mixins(GlobalMixins) {
	private imgs: Imgs = {
		loginBanner: require('assets/home/banner.jpg'),
	};

	private loading: boolean = false;

	public async githubLogin() {
		const provider = new firebase.auth.GithubAuthProvider();
		provider.addScope('repo');
		provider.addScope('admin:repo_hook');
		provider.addScope('user');
		provider.addScope('delete_repo');
		provider.addScope('workflow');

		// for GraphQL
		provider.addScope('read:org');
		provider.addScope('read:public_key');
		provider.addScope('read:gpg_key');

		await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
		firebase
			.auth()
			.signInWithPopup(provider)
			.then((result: Record<string, any>) => {
				const user: User = {
					displayName: result.user.displayName,
					photoURL: result.user.photoURL,
					email: result.user.email,
					accessToken: result.credential.accessToken,
					userName: result.additionalUserInfo.username,
				};
				this.$store.commit('setUser', user);
				this.$session.write('userInfo', user);
				this.$assign('/dashboard');
			}).catch((error) => {
				console.error(error);
			});
	}
}
</script>
