<!--
 * DashboardTheme.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
 *
 * Refrense: https://hexo.io/docs/themes.html#Publishing
 *
-->
<template>
	<div>
		<h1>Hello Theme</h1>
		<v-row>
			<v-col
	   			xs="12"
	   			ms="6"
	   			lg="4"
	   			xl="3"
		  		v-for="(theme, idx) in themes"
				:key="theme.name + idx">
				<theme-item :theme="theme"/>
			</v-col>
			<infinite-loading @infinite="nextPostLoading" />
		</v-row>
	</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Theme } from '@/interface/service';
import ThemeItem from './DashboardThemeItem.vue';
import InfiniteLoading from 'vue-infinite-loading';

@Component({
	components: {
		ThemeItem,
		InfiniteLoading,
	},
})
export default class DashboardTheme extends Mixins(GlobalMixins) {

	public themes: Theme[] = [];
	public allThemes: Theme[] = [];
	public themeIdx: number = 0;
	public readonly repo: string = 'hexojs/site';
	public readonly loadNumPerOneTime: number = 20;

	public async mounted() {
		this.$logger.debug('app', 'DashboardTheme mounted');
		this.allThemes = await this.$git.getContent<Theme[]>('source/_data/themes.yml', 'yaml', this.repo);
		await this.nextPostLoading();
	}

	public genThumbnailUrl(name: string) {
		return `https://raw.githubusercontent.com/${this.repo}/master/source/themes/screenshots/${name}.png`;
	}

	public async nextPostLoading($state?: any) {
		for ( let i = 0; i < this.loadNumPerOneTime; i++ ) {
			if ( this.themeIdx < this.allThemes.length ) {
				const theme = this.allThemes[this.themeIdx++];
				try {
					const thumbnail = this.genThumbnailUrl(theme.name);
					await this.$axios.get(thumbnail);
					theme.thumbnail = thumbnail;
				} catch {
					theme.thumbnail = this.genThumbnailUrl(theme.name.toLowerCase());
					console.log('404 error', theme.thumbnail);
				}
				this.themes.push(theme);
			}
		}
		if ( $state ) {
			console.log(this.themeIdx, this.allThemes.length);
			if ( this.themeIdx < this.allThemes.length ) {
				$state.loaded();
			} else {
				$state.complete();
			}
		}
	}

}
</script>
