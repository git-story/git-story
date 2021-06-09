<!--
 * DashboardSidebar.vue
 * Created on Thu Mar 25 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<div class="col-3" style="padding-right: 20px; position: fixed;">
		<v-btn
	 		tile dark
	  		large block
			color="indigo darken-3"
			@click="$assign('/posting/')">
			{{ $t('dashboard.new-posting') }}
		</v-btn>

		<v-card tile class="mt-4">
			<v-card-title>
				<p class="ma-0 text-right w-100">{{ $t('dashboard.blog.content') }}</p>
			</v-card-title>
			<v-divider />
			<v-list flat>
				<dash-list-item href="/dashboard/posts" icon="playlist-edit">{{ $t('dashboard.content.posts') }}</dash-list-item>
				<dash-list-item href="/dashboard/category" icon="shape">{{ $t('dashboard.content.category') }}</dash-list-item>
			</v-list>
		</v-card>

		<v-card tile class="mt-6">
			<v-card-title>
				<p class="ma-0 text-right w-100">{{ $t('dashboard.blog.setting') }}</p>
			</v-card-title>
			<v-divider />
			<v-list flat>
				<dash-list-item href="/dashboard/theme" icon="compare">{{ $t('dashboard.setting.theme') }}</dash-list-item>
				<!--
				<dash-list-item href="/dashboard/template" icon="layers-triple">{{ $t('dashboard.setting.template') }}</dash-list-item>
				<dash-list-item href="/dashboard/comment" icon="comment-multiple">{{ $t('dashboard.setting.comment') }}</dash-list-item>
				-->
				<dash-list-item href="/dashboard/setting" icon="cog">{{ $t('dashboard.setting.etc') }}</dash-list-item>
				<dash-list-item href="/dashboard/config" icon="microsoft-visual-studio-code">{{ $t('dashboard.setting.config') }}</dash-list-item>
			</v-list>
		</v-card>

		<v-btn
	 		tile dark
	  		large block
	  		class="mt-4"
			color="red darken-3"
			@click="logout">
			{{ $t('logout') }}
		</v-btn>
	</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Imgs } from 'types/index';
import DashListItem from './DashboardSidebarItem.vue';
import firebase from 'firebase';

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

	public logout() {
		firebase.auth().signOut().finally(() => {
			this.$session.write('userInfo', '');
			this.$assign('/');
		});
	}

}
</script>
