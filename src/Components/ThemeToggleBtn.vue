<!--
 * ThemeToggleBtn.vue
 * Created on Fri Jun 11 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-btn
		icon plain
		:color="btnColor || 'black'"
	 	:class="btnClass || ''"
		@click.stop="toggleTheme">
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
	@Prop(String) public btnClass!: string;

	get theme() {
		return this.$vuetify.theme.dark;
	}

	public toggleTheme() {
		this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
		if ( this.$vuetify.theme.dark ) {
			(document.querySelector('link[title=github-dark]') as HTMLElement).removeAttribute('disabled');
			(document.querySelector('link[title=github]') as HTMLElement).setAttribute('disabled', 'disabled');
			window.monaco.editor.setTheme('vs-dark');
			this.$local.write('theme', 'dark');
		} else {
			(document.querySelector('link[title=github-dark]') as HTMLElement).setAttribute('disabled', 'disabled');
			(document.querySelector('link[title=github]') as HTMLElement).removeAttribute('disabled');
			window.monaco.editor.setTheme('vs');
			this.$local.write('theme', 'light');
		}
		this.$logger.debug('app', `Theme toggle to ${this.theme ? 'dark' : 'light'}`);
	}

}
</script>
