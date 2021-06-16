<!--
 * SettingBlog.vue
 * Created on Tue Jun 15 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-container class="pa-4">
		<v-row class="ma-0">
			<v-col cols="12" class="pt-0">
				<h2>{{ $t('dashboard.setting.menu.blog') }}</h2>
			</v-col>
		</v-row>
		<v-divider class="my-6"></v-divider>

		<v-row class="ma-0">
			<v-col cols="12">
				<h3>{{ $t('dashboard.setting.blog.custom-domain') }}</h3>
				<p
					class="mt-3" style="font-size: 11pt;"
					v-html="$t('dashboard.setting.blog.custom-domain-desc', ($git.repo && $git.repo.name) || 'loading')"></p>
				<div class="d-flex">
					<v-text-field
						flat dense rounded filled
		 				hide-details
		 				v-model="cname"
		 				color="indigo darken-1"
						class="mr-2">
					</v-text-field>
					<v-btn
		 				class="mr-2"
	   					text
	   					:disabled="info.cname === cname"
	   					@click="saveCname"
						depressed>
						{{ $t('save') }}
					</v-btn>
					<v-btn
		 				text
		 				:dark="!!info.cname"
		 				color="red"
	   					:disabled="!info.cname"
						depressed>
						{{ $t('remove') }}
					</v-btn>
				</div>
			</v-col>
		</v-row>

		<v-row class="ma-0">
			<v-col cols="12">
				<v-row class="ma-0" align="center">
					<h3>{{ $t('dashboard.setting.blog.enforce-https') }}</h3>
					<v-checkbox
		 				v-model="https"
	   					:disabled="!info.cname"
	   					@click="saveHttps"
	   					color="indigo darken-1"
		 				class="ma-0 ml-3 mb-1"
						hide-details/>
				</v-row>
				<p
					class="mt-3" style="font-size: 11pt;"
					v-html="$t('dashboard.setting.blog.enforce-https-desc')"></p>
			</v-col>
		</v-row>

		<v-row class="ma-0">
			<v-col cols="12">
				<v-row class="ma-0" align="center">
					<h3>{{ $t('dashboard.setting.blog.allow-post-gather') }}</h3>
					<v-checkbox
		 				v-model="allowGather"
	   					:disabled="true"
	   					color="indigo darken-1"
		 				class="ma-0 ml-3 mb-1"
						hide-details/>
				</v-row>
				<p
					class="mt-3" style="font-size: 11pt;"
					v-html="$t('dashboard.setting.blog.allow-post-gather-desc')"></p>
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
export default class SettingBlog extends Mixins(GlobalMixins) {

	public info: any = {};
	public cname: string = '';
	public https: boolean = false;
	public allowGather: boolean = true;

	public async mounted() {
		while ( !this.$git.User || !this.$git.repo ) {
			await this.$sleep(100);
		}

		const res = await this.$git.rest.repos.getPages({
			owner: this.$git.User.userName,
			repo: this.$git.repo.name,
		});

		this.info = res.data;
		this.cname = this.info.cname;
		this.https = this.info.https_enforced;
	}

	public async saveCname() {
		this.$store.commit('loading', true);
		this.$store.commit('loadmsg', 'CNAME 정보 업데이트');

		await this.$git.rest.repos.updateInformationAboutPagesSite({
			owner: this.$git.User.userName,
			repo: this.$git.repo.name,
			cname: this.cname,
		});

		this.info.cname = this.cname;

		this.$store.commit('loading', false);
	}

	public async saveHttps() {
		this.$store.commit('loading', true);
		this.$store.commit('loadmsg', 'HTTPS 강요 정보 업데이트');

		await this.$git.rest.repos.updateInformationAboutPagesSite({
			owner: this.$git.User.userName,
			repo: this.$git.repo.name,
			https_enforced: this.https,
		});

		this.info.https_enforced = this.https;

		this.$store.commit('loading', false);
	}

}
</script>
