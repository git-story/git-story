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
		<v-row v-if="renderer && themes.length > 0">
			<v-col
				xs="12"
				ms="6"
				lg="4"
				xl="3"
				v-for="(theme, idx) in themes"
				:key="theme.name + idx">
				<theme-item :theme="theme" @changeit="themeChange"/>
			</v-col>
			<infinite-loading @infinite="nextThemeLoading">
				<template v-slot:no-results>
					<span></span>
				</template>
			</infinite-loading>
		</v-row>
		<v-row v-else>
			<v-col
				xs="12"
				ms="6"
				lg="4"
				xl="3"
				v-for="(empty, idx) in skeleton"
				:key="'skeleton' + idx">
				<v-skeleton-loader
					v-bind="{
						boilerplate: true,
						elevation: 2,
					}"
					type="image, divider, table-heading, list-item-two-line">
				</v-skeleton-loader>
			</v-col>
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
	public readonly repo: string = 'git-story/hexo-themes';
	public readonly loadNumPerOneTime: number = 20;
	public config: any = {};
	public modules: Submodule = {};
	public renderer: boolean = true;

	public skeletonLength: number = 12;
	public skeleton: any[] = new Array(this.skeletonLength);

	get themeNames() {
		return this.allThemes.map((theme: Theme) => theme.name);
	}

	public rerender() {
		this.renderer = false;
		this.$git.clear();
		this.$nextTick(() => {
			this.renderer = true;
		});
	}

	public async mounted() {
		this.$logger.debug('app', 'DashboardTheme mounted');
		this.allThemes = await this.$git.getContent<Theme[]>('index.yml', 'yaml', this.repo);
		while ( true ) {
			this.config = await this.$git.getContent<any>('_config.yml', 'yaml');
			if ( this.config ) {
				break;
			}
			await this.$sleep(1000);
		}
		await this.$git.clear();
		this.modules = await this.$git.getContent<Submodule>('.gitmodules', 'submodule');
		this.$logger.debug('theme', 'config', this.config);
		this.$logger.debug('theme', 'allThemes', this.allThemes);
		this.$logger.debug('theme', 'modules', this.modules);
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

	public async nextThemeLoading($state?: any) {
		for ( let i = 0; i < this.loadNumPerOneTime; i++ ) {
			if ( this.themeIdx < this.allThemes.length ) {
				const theme = this.allThemes[this.themeIdx++];
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
		this.$store.commit('loading', true);
		const entries = Object.entries(this.modules);
		const themePath = `themes/${theme.name}`;

		await this.$git.clear();

		const themeConfig = await this.$git.getContent<any>(`${theme.name.toLowerCase()}.yml`, 'yaml', this.repo);
		if ( themeConfig ) {
			if ( themeConfig.config ) {
				const cfgs = Object.entries(themeConfig.config);
				for ( const [key, cfg] of cfgs ) {
					this.config[key] = cfg;
				}
			}

			if ( themeConfig.plugins ) {
				const pack = await this.$git.getContent<any>('package.json', 'json');
				for ( const plugin of themeConfig.plugins ) {
					if ( !pack.dependencies[plugin] ) {
						pack.dependencies[plugin] = 'latest';
					}
				}
				this.$git.update('package.json', JSON.stringify(pack, null, '\t'));
			}
		}

		this.modules[theme.name] = {
			path: themePath,
			url: theme.link,
		};
		this.$git.update('.gitmodules', serialize(this.modules));

		const repoName = theme.link.replace('https://github.com/', '');
		const ref = await this.$git.getTreeByRef(repoName);
		this.$git.add(themePath, ref.sha, 'link');

		this.config.theme = theme.name;
		this.$git.update('_config.yml', yaml.dump(this.config));

		await this.$git.workflowClear();
		await this.$git.commit(`CHANGE THEME ${theme.name}`);

		for ( let i = 0; i < this.themes.length; i++ ) {
			const t = this.themes[i];

			if ( t.used ) {
				t.used = false;
				this.allThemes[i].used = false;
			}

			if ( theme.name === t.name ) {
				t.used = true;
				this.allThemes[i].used = true;
			}

		}

		this.rerender();

		this.$store.commit('loading', false);
	}

}
</script>
