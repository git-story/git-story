<!--
 * Dashboard.vue
 * Created on Thu Aug 06 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-main class="vh-100">
		<v-row class="ma-0 h-100">
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

@Component({
	components: {
		DashboardSidebar,
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
