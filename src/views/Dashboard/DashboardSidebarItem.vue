<!--
 * DashboardSidebarItem.vue
 * Created on Thu Mar 25 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-list-item @click="">
		<v-list-item-icon>
			<v-icon v-text="'mdi-' + icon" />
		</v-list-item-icon>
		<v-list-item-content>
			<v-list-item-title class="text-right">
				<slot></slot>
			</v-list-item-title>
		</v-list-item-content>
	</v-list-item>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

@Component({
	components: {
	},
})
export default class DashboardSidebar extends Mixins(GlobalMixins) {

	@Prop(String) public icon!: string;
	@Prop(String) public href!: string;

}
</script>
