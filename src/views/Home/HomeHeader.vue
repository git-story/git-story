<!--
 * HomeHeader.vue
 * Created on Tue Jul 14 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-app-bar
		color="transparent"
  		style="transform: translateY(24px);"
		>
		<v-app-bar-nav-icon />
		<v-toolbar-title>
			<router-link style="text-decoration: none" class="white--text" to="/">
				GIT STORY
			</router-link>
		</v-toolbar-title>

		<v-spacer />

		<v-btn icon>
			<v-icon>mdi-magnify</v-icon>
		</v-btn>
	</v-app-bar>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

@Component
export default class HomeHeader extends Mixins(GlobalMixins) {
}
</script>
