<!--
 * Dashboard.vue
 * Created on Thu Aug 06 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-main>
		<h1>This is dashboard</h1>
	</v-main>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Imgs } from 'types/index';

@Component({
	components: {
	},
})
export default class Dashboard extends Mixins(GlobalMixins) {
	private imgs: Imgs = {
	};
}
</script>
