<!--
 * DashboardSidebar.vue
 * Created on Thu Mar 25 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<div class="pt-0" style="padding: 2rem;">
		<!--
		<v-btn
	 		tile dark
	  		large block
			color="indigo darken-3"
			@click="$assign('/posting/')">
			{{ $t('dashboard.new-posting') }}
		</v-btn>
		-->

		<v-card tile class="mt-4 card-transparent" flat>
			<v-card-title>
				<p class="ma-0 text-right w-100">{{ $t('dashboard.blog.content') }}</p>
			</v-card-title>
			<v-divider />
			<v-list flat rounded>
				<dash-list-item href="/dashboard/posts" icon="playlist-edit">{{ $t('dashboard.sidebar.posts') }}</dash-list-item>
				<dash-list-item href="/dashboard/category" icon="shape">{{ $t('dashboard.sidebar.category') }}</dash-list-item>
			</v-list>
		</v-card>

		<v-card tile class="mt-6 card-transparent" flat>
			<v-card-title>
				<p class="ma-0 text-right w-100">{{ $t('dashboard.blog.setting') }}</p>
			</v-card-title>
			<v-divider />
			<v-list flat rounded>
				<dash-list-item href="/dashboard/theme" icon="compare">{{ $t('dashboard.sidebar.theme') }}</dash-list-item>
				<!--
				<dash-list-item href="/dashboard/template" icon="layers-triple">{{ $t('dashboard.setting.template') }}</dash-list-item>
				<dash-list-item href="/dashboard/comment" icon="comment-multiple">{{ $t('dashboard.setting.comment') }}</dash-list-item>
				-->
				<dash-list-item href="/dashboard/setting" icon="cog">{{ $t('dashboard.sidebar.etc') }}</dash-list-item>
				<dash-list-item href="/dashboard/config" icon="microsoft-visual-studio-code">{{ $t('dashboard.sidebar.config') }}</dash-list-item>
			</v-list>
		</v-card>
	</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Imgs } from 'types/index';
import DashListItem from './DashboardSidebarItem.vue';

@Component({
	components: {
		DashListItem,
	},
})
export default class DashboardSidebar extends Mixins(GlobalMixins) {
	private imgs: Imgs = {
	};

	public mounted() {
		this.$logger.debug('app', 'DashboardSidebar mounted');
	}


}
</script>
