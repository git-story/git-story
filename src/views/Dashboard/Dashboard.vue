<!--
 * Dashboard.vue
 * Created on Thu Aug 06 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-main class="vh-100">
		<dashboard-header />
		<v-row class="white" style="min-height: calc(100vh - 64px); margin-top: 64px;">
			<v-col cols="3">
				<dashboard-sidebar />
			</v-col>
			<v-col cols="9">
				<router-view></router-view>
			</v-col>
		</v-row>
	</v-main>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Imgs } from 'types/index';
import DashboardSidebar from './DashboardSidebar.vue';
import DashboardHeader from './DashboardHeader.vue';

@Component({
	components: {
		DashboardSidebar,
		DashboardHeader,
	},
})
export default class Dashboard extends Mixins(GlobalMixins) {
	private imgs: Imgs = {
	};

	public mounted() {
		this.$logger.debug('app', 'Dashboard mounted');
	}
}
</script>
