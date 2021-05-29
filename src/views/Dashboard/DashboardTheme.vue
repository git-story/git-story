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
		<v-row class="ma-0" align="center">
			<h1>{{ $t('dashboard.setting.theme') }}</h1>
			<v-spacer></v-spacer>
			<v-text-field
				v-model="search"
				:label="$t('dashboard.theme.search')"
				@keydown="inputEvent"
				class="custom"
				color="indigo"
				append-icon="mdi-magnify">
			</v-text-field>
		</v-row>
		<v-divider class="my-2"></v-divider>
		<v-row>
			<v-col
	   			xs="12"
	   			ms="6"
	   			lg="4"
	   			xl="3"
		  		v-for="(theme, idx) in themes"
				:key="theme.name + idx">
				<theme-item :theme="theme" @changeit="themeChange"/>
			</v-col>
			<infinite-loading @infinite="nextThemeLoading" />
		</v-row>
	</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Theme } from '@/interface/service';
import ThemeItem from './DashboardThemeItem.vue';
import InfiniteLoading from 'vue-infinite-loading';
import { Submodule, serialize } from 'git-submodule-js';
import yaml from 'js-yaml';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
	public search: string = '';
	public readonly repo: string = 'hexojs/site';
	public readonly loadNumPerOneTime: number = 20;
	public config: any = {};
	public modules: Submodule = {};

	get themeNames() {
		return this.allThemes.map((theme: Theme) => theme.name);
	}

	public async mounted() {
		this.$logger.debug('app', 'DashboardTheme mounted');
		this.allThemes = await this.$git.getContent<Theme[]>('source/_data/themes.yml', 'yaml', this.repo);
		while ( true ) {
			this.config = await this.$git.getContent<any>('_config.yml', 'yaml');
			if ( this.config ) {
				break;
			}
			await sleep(1000);
		}
		await this.$git.clear();
		this.modules = await this.$git.getContent<Submodule>('.gitmodules', 'submodule');
		console.log('config', this.config);
		console.log('allThemes', this.allThemes);
		console.log('modules', this.modules);
		await this.nextThemeLoading();
	}

	public inputEvent(evt: KeyboardEvent) {
		if ( evt.keyCode === 13 ) {
			// enter
			this.searchEvent();
		}
	}

	public async searchEvent() {
		const ret: Theme[] = [];
		if ( !this.search ) {
			this.themeIdx = 0;
			this.themes = [];
			this.nextThemeLoading();
		}
		for ( const theme of this.allThemes ) {
			const regex = new RegExp(this.search, 'i');
			if ( theme.name.match(regex) ) {
				if ( !theme.thumbnail ) {
					await this.themeThumbnail(theme);
				}
				if ( theme.name === this.config.theme ) {
					theme.used = true;
				} else {
					theme.used = false;
				}
				ret.push(theme);
			}
		}
		this.themes = ret;
	}

	public genThumbnailUrl(name: string) {
		return `https://raw.githubusercontent.com/${this.repo}/master/source/themes/screenshots/${name}.png`;
	}

	public async themeThumbnail(theme: Theme) {
		try {
			const thumbnail = this.genThumbnailUrl(theme.name);
			await this.$axios.get(thumbnail);
			theme.thumbnail = thumbnail;
		} catch {
			theme.thumbnail = this.genThumbnailUrl(theme.name.toLowerCase());
		}
		return theme;
	}

	public async nextThemeLoading($state?: any) {
		for ( let i = 0; i < this.loadNumPerOneTime; i++ ) {
			if ( this.themeIdx < this.allThemes.length ) {
				const theme = this.allThemes[this.themeIdx++];
				if ( !theme.thumbnail ) {
					await this.themeThumbnail(theme);
				}
				if ( theme.name === this.config.theme ) {
					theme.used = true;
				} else {
					theme.used = false;
				}
				this.themes.push(theme);
			}
		}
		if ( $state ) {
			if ( this.themeIdx < this.allThemes.length ) {
				$state.loaded();
			} else {
				$state.complete();
			}
		}
	}

	public async themeChange(theme: Theme) {
		const entries = Object.entries(this.modules);
		const themePath = `themes/${theme.name}`;
		let addFlag: boolean = true;

		for ( const [ key, value ] of entries ) {
			if ( key.toLowerCase() === theme.name.toLowerCase() ) {
				addFlag = false;
				break;
			}
		}

		const updateQ: any[] = [];

		if ( addFlag ) {
			this.modules[theme.name] = {
				path: themePath,
				url: theme.link,
			};
			updateQ.push([
				'.gitmodules',
				serialize(this.modules),
				'utf-8',
			]);

			const repoName = theme.link.replace('https://github.com/', '');
			await this.$git.clear();
			const ref = await this.$git.getTreeByRef(repoName);
			this.$git.add(themePath, ref.sha, 'link');
		}

		this.config.theme = theme.name;
		updateQ.push([
			'_config.yml',
			yaml.dump(this.config),
			'utf-8',
		]);

		await this.$git.workflowClear();

		await this.$git.done();
		for ( const Q of updateQ ) {
			await this.$git.update(Q[0], Q[1], Q[2]);
		}
		await this.$git.commit(`ADD THEME ${theme.name}`);

	}

}
</script>
