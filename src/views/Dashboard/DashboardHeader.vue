<!--
 * DashboardHeader.vue
 * Created on Fri Jun 11 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-app-bar
		color="white"
  		flat fixed>
		<v-app-bar-nav-icon class="d-sm-none"></v-app-bar-nav-icon>

		<v-toolbar-title>GIT STORY</v-toolbar-title>

		<v-spacer></v-spacer>

		<theme-toggle-btn btn-color="black" />
	</v-app-bar>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

@Component({
	components: {
	},
})
export default class DashboardHeader extends Mixins(GlobalMixins) {

	public mounted() {
		this.$logger.debug('app', 'Dashboard Header mounted');
	}

}
</script>
