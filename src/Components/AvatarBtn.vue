<!--
 * AvatarBtn.vue
 * Created on Mon Jun 14 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-menu
	 	close-on-click
		bottom offset-y
	 	tile
	 	content-class="elevation-2"
	 	min-width="200px"
	 	nudge-bottom="22">
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				icon plain
	   			:color="btnColor"
	   			:class="btnClass"
				v-bind="attrs"
				v-on="on">
				<v-avatar size="32px">
					<v-img :src="$store.getters.user.photoURL"/>
				</v-avatar>
			</v-btn>
		</template>

		<v-list
			dense
			class="thin-outline">
			<v-list-item-group>
				<v-list-item @click="$assign($git.repo.owner.html_url, true)">
					<v-list-item-icon class="mr-3">
						<v-icon dense>mdi-account</v-icon>
					</v-list-item-icon>
					<v-list-item-content style="font-size: 10pt;">
						{{ $t('my-account') }}
					</v-list-item-content>
				</v-list-item>
				<v-list-item @click="$assign(`https://${$git.repo.name}`, true)">
					<v-list-item-icon class="mr-3">
						<v-icon dense>mdi-post</v-icon>
					</v-list-item-icon>
					<v-list-item-content style="font-size: 10pt;">
						{{ $t('my-blog') }}
					</v-list-item-content>
				</v-list-item>
				<v-list-item @click="$assign($git.repo.html_url, true)">
					<v-list-item-icon class="mr-3">
						<v-icon dense>mdi-github</v-icon>
					</v-list-item-icon>
					<v-list-item-content style="font-size: 10pt;">
						{{ $t('blog-github') }}
					</v-list-item-content>
				</v-list-item>
				<v-divider class="my-2"></v-divider>
				<v-list-item @click="logout">
					<v-list-item-icon class="mr-3">
						<v-icon dense>mdi-logout</v-icon>
					</v-list-item-icon>
					<v-list-item-content style="font-size: 10pt;">
						{{ $t('logout') }}
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-menu>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

import firebase from 'firebase';

@Component
export default class AvatarBtn extends Mixins(GlobalMixins) {

	@Prop(String) public btnColor!: string;
	@Prop(String) public btnClass!: string;

	get theme() {
		return this.$vuetify.theme.dark;
	}

	public toggleTheme() {
		this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
		if ( this.$vuetify.theme.dark ) {
			window.monaco.editor.setTheme('vs-dark');
			this.$local.write('theme', 'dark');
		} else {
			window.monaco.editor.setTheme('vs');
			this.$local.write('theme', 'light');
		}
		this.$logger.debug('app', `Theme toggle to ${this.theme ? 'dark' : 'light'}`);
	}

	public logout() {
		firebase.auth().signOut().finally(() => {
			this.$session.write('userInfo', '');
			this.$assign('/');
		});
	}

}
</script>
