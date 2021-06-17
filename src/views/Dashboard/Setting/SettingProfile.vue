<!--
 * SettingProfile.vue
 * Created on Tue Jun 15 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-container class="pa-4">
		<v-row class="ma-0">
			<v-col cols="12" class="pt-0">
				<h2>{{ $t('dashboard.setting.menu.profile') }}</h2>
			</v-col>
		</v-row>
		<v-divider class="my-6"></v-divider>

		<v-row class="ma-0">
			<v-col cols="12">
				<h3>{{ $t('dashboard.setting.profile.remove-blog') }}</h3>
				<p
					class="mt-3" style="font-size: 11pt;"
					v-html="$t('dashboard.setting.profile.remove-blog-desc')"></p>
				<v-row align="center" class="mt-1">
					<v-text-field
						flat dense rounded filled
		 				hide-details
		 				:placeholder="$t('dashboard.setting.profile.remove-blog-check')"
		 				v-model="blogRemove"
		 				color="indigo darken-1"
						class="mr-2">
					</v-text-field>
					<v-btn
		 				text
		 				:dark="blogCheck"
		 				color="red"
	   					:disabled="!blogCheck"
	   					@click="removeBlog"
						depressed>
						{{ $t('remove') }}
					</v-btn>
				</v-row>
			</v-col>
		</v-row>

		<v-row class="ma-0 mt-5">
			<v-col cols="12">
				<h3>{{ $t('dashboard.setting.profile.unsubscribe') }}</h3>
				<p
					class="mt-3" style="font-size: 11pt;"
					v-html="$t('dashboard.setting.profile.unsubscribe-desc')"></p>
				<v-row align="center" class="mt-1">
					<v-text-field
						flat dense rounded filled
		 				hide-details
		 				:placeholder="$t('dashboard.setting.profile.unsubscribe-check')"
		 				v-model="unsubscribe"
		 				color="indigo darken-1"
						class="mr-2">
					</v-text-field>
					<v-btn
		 				text
		 				:dark="unsubCheck"
		 				color="red"
	   					:disabled="!unsubCheck"
	   					@click="unsubAcc"
						depressed>
						{{ $t('remove') }}
					</v-btn>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

@Component({
	components: {
	},
})
export default class SettingProfile extends Mixins(GlobalMixins) {

	public blogRemove: string = '';
	public unsubscribe: string = '';

	get blogCheck() {
		return this.blogRemove === this.$t('dashboard.setting.profile.remove-blog-check');
	}

	get unsubCheck() {
		return this.unsubscribe === this.$t('dashboard.setting.profile.unsubscribe-check');
	}

	public removeBlog() {
		this.$confirm({
			title: this.$t('notice'),
			content: this.$t('dashboard.setting.profile.remove-blog-confirm'),
			type: 'warning',
			textOk: this.$t('confirm'),
			textCancel: this.$t('cancel'),
		}).then(async (close) => {
			close();
			this.$store.commit('loadmsg',
				this.$t('dashboard.setting.profile.remove-blog-laoding', this.$git.repo.name));
			this.$store.commit('loading', true);

			await this.$git.clear();
			await this.$git.rest.repos.delete({
				owner: this.$store.getters.user.userName,
				repo: this.$git.repo.name,
			});

			await this.$logout();
			this.$store.commit('loading', false);
			this.$assign('/');
		}).catch((close) => close());
	}

	public unsubAcc() {
		this.$confirm({
			title: this.$t('confirm'),
			content: this.$t('dashboard.setting.profile.unsubscribe-confirm'),
			textOk: this.$t('yes'),
			textCancel: this.$t('cancel'),
		}).then(async (close) => {
			try {
				await this.$firebase.user.delete();
			} catch {
				// TODO: reauth
			}
			close();
			this.$assign('/');
		}).catch((close) => close());
	}

}
</script>
