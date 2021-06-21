<!--
 * DashboardSetting.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-row class="h-100 ma-0">
		<!-- S: Left Panel -->
		<v-col cols="6">
			<!-- S: Contribution -->
			<v-row class="ma-0">
				<v-col cols="12">
					<contribution />
				</v-col>
			</v-row>
			<!-- E: Contribution -->
			<v-list two-line class="pa-0 custom">
				<v-list-item-group
					:value="selected"
  					multiple>
					<template
		 				v-for="(link, idx) in linkList">
						<setting-link
		  					:key="'setting-link-' + link + idx"
							:keyname="link.key"
							:title="link.title"
							:icon="link.icon">
							{{ link.content }}
						</setting-link>
						<v-divider
							v-if="idx < linkList.length - 1"
	   						:key="'setting-link-divider-' + link + idx"/>
					</template>
				</v-list-item-group>
			</v-list>
		</v-col>
		<!-- E: Left Panel -->
		<v-divider vertical></v-divider>
		<!-- S: Right Panel -->
		<v-col cols="6">
			<router-view></router-view>
		</v-col>
		<!-- E: Right Panel -->
	</v-row>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import Contribution from './Setting/SettingContribution.vue';
import SettingLink from './Setting/SettingLink.vue';

interface Link {
	key: string;
	title: string;
	content: string;
	icon: string;
}

@Component({
	components: {
		Contribution,
		SettingLink,
	},
})
export default class DashboardSetting extends Mixins(GlobalMixins) {

	public config: any = {};
	public linkList: Link[] = [
		{
			key: 'blog',
			title: this.$t('dashboard.setting.menu.blog'),
			content: this.$t('dashboard.setting.menu.blog-desc'),
			icon: 'mdi-post',
		},
		{
			key: 'profile',
			title: this.$t('dashboard.setting.menu.profile'),
			content: this.$t('dashboard.setting.menu.profile-desc'),
			icon: 'mdi-account',
		},
	];

	public get selected() {
		const idx = this.linkList.findIndex(
			(link: Link) => `/${this.$route.params.lang}/dashboard/setting/${link.key}` === this.$route.fullPath,
		);
		return idx > -1 ? [ idx ] : [ 0 ];
	}

	public async mounted() {
		this.$logger.debug('app', 'DashboardSetting mounted');
		this.config = await this.$getConfig();
		console.log(this.$refs.group);
	}

}
</script>
