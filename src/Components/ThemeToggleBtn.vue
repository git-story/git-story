<!--
 * ThemeToggleBtn.vue
 * Created on Fri Jun 11 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-btn icon :color="btnColor || 'grey lighten-5'" @click.stop="toggleTheme">
		<v-icon>
			{{
				theme ?
				'mdi-weather-night' :
				'mdi-white-balance-sunny'
			}}
		</v-icon>
	</v-btn>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

@Component
export default class ThemeToggleBtn extends Mixins(GlobalMixins) {

	@Prop(String) public btnColor!: string;

	get theme() {
		return this.$vuetify.theme.dark;
	}

	public toggleTheme() {
		this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
		this.$logger.debug('app', `Theme toggle to ${this.theme ? 'dark' : 'light'}`);
	}

}
</script>
