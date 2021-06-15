<!--
 * SettingBlog.vue
 * Created on Tue Jun 15 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<h1>Setting Blog</h1>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

@Component({
	components: {
	},
})
export default class SettingBlog extends Mixins(GlobalMixins) {

	public async mounted() {
	}

}
</script>
