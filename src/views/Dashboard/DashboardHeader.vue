<!--
 * DashboardHeader.vue
 * Created on Fri Jun 11 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-app-bar
		color="grey lighten-4"
  		elevate-on-scroll
  		fixed>
		<v-app-bar-nav-icon class="d-sm-none"></v-app-bar-nav-icon>

		<v-img class="ml-2" :src="imgs.logo" max-width="32" height="32"/>

		<v-toolbar-title class="ml-4">{{ $store.getters.user.userName }}.github.io</v-toolbar-title>

		<v-spacer></v-spacer>

		<theme-toggle-btn class="mr-2" btn-color="black" />
	</v-app-bar>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Imgs } from 'types/index';

@Component({
	components: {
	},
})
export default class DashboardHeader extends Mixins(GlobalMixins) {

	public imgs: Imgs = {
		logo: require('assets/logo.svg'),
	};

	public mounted() {
		this.$logger.debug('app', 'Dashboard Header mounted');
	}

}
</script>
