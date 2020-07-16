<!--
 * Home.vue
 * Created on Tue Jul 14 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<HomeBanner />
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import HomeBanner from './HomeBanner.vue';

@Component({
	components: {
		HomeBanner,
	},
})
export default class Home extends Mixins(GlobalMixins) {
}
</script>
