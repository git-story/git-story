<!--
 * DashboardSetting.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<div>
		<h1>{{ $t('dashboard.etc.title') }}</h1>
		<v-divider class="my-4"></v-divider>

		<v-container class="px-0">
			<v-row align="center">
				<v-col cols="6">
					<h2>robots.txt</h2>
				</v-col>
				<v-col cols="6" align="right">
					<v-btn
						tile dark
						color="green darken-2"
						@click="robotSave">
						{{ $t('save') }}
					</v-btn>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<monaco-editor
						ref="code-editor"
	  					style="height: 200px; width: 100%; border: 1px solid #acacac;"
						v-model="editor.code"
						:language="editor.language"
						:theme="editor.theme"
						:options="editor.options"/>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import firebase from 'firebase';
import yaml from 'js-yaml';

@Component({
	components: {
	},
})
export default class DashboardSetting extends Mixins(GlobalMixins) {
	public editor: any = {
		options: {
			automaticLayout: true,
		},
		language: 'yaml',
		code: '',
		theme: this.$vuetify.theme.dark ? 'vs-dark' : 'vs',
	};
	public config: any = {};

	public async mounted() {
		this.$logger.debug('app', 'DashboardSetting mounted');
		this.config = await this.$getConfig();
		this.editor.code = yaml.dump(this.config.robotstxt);
	}

	public async robotSave() {
		this.$store.commit('loading', true);
		try {
			this.config.robotstxt = yaml.load(this.editor.code);
			const content = yaml.dump(this.config);
			this.$git.clear();
			this.$git.workflowClear();
			this.$git.update('_config.yml', content);
			await this.$git.commit('UPDATE: robots.txt update');
		} catch (err) {
			this.$logger.error('etc', err);
			const close = await this.$modal({
				title: this.$t('error'),
				content: this.$t('dashboard.etc.robots-save.error'),
				textOk: this.$t('confirm'),
			});
			close();
		}
		this.$store.commit('loading', false);
	}

}
</script>
