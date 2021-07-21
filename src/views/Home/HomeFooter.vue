<!--
 * HomeFooter.vue
 * Created on Fri Jul 17 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-footer
		dark
		padless>
		<v-card
			flat tile
			width="100%"
			class="text-center"
			style="background: black; color: white;">
			<v-card-text>
				<v-btn
					class="mx-4"
					@click="$assign('https://github.com/git-story/git-story/', true)"
					icon>
					<v-icon size="24px">mdi-github</v-icon>
				</v-btn>
			</v-card-text>

			<v-divider></v-divider>

			<v-card-text>
				{{ new Date().getFullYear() }} - <strong>Git Story</strong>
			</v-card-text>
		</v-card>
	</v-footer>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

@Component
export default class HomeFooter extends Mixins(GlobalMixins) {
}
</script>
