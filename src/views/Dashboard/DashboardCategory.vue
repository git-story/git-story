<!--
 * DashboardCategory.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<div>
		<h1>Hello Category</h1>
	</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

@Component({
	components: {
	},
})
export default class DashboardCategory extends Mixins(GlobalMixins) {

	public mounted() {
		this.$logger.debug('app', 'DashboardCateogry mounted');
	}

}
</script>
