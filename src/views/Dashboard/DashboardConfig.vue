<!--
 * DashboardConfig.vue
 * Created on Thu May 27 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-row class="ma-0" style="height: calc(100vh - 50px);">
		<v-col cols="8">
			<monaco-editor
				ref="code-editor"
				class="editor"
				v-model="editor.code"
				:language="editor.language"
				:theme="editor.theme"
				:options="editor.options"/>
		</v-col>
		<v-col cols="4">
			<v-row class="ma-0" style="height: 20%;">
				<v-col cols="12">
					<h3>{{ $t('dashboard.config.format') }}</h3>
					<v-divider class="my-2"></v-divider>
					<v-radio-group v-model="editor.language" row @change="change">
						<v-radio label="yaml" value="yaml" color="indigo"></v-radio>
						<v-radio label="json" value="json" color="indigo"></v-radio>
					</v-radio-group>
				</v-col>
			</v-row>
			<v-row class="ma-0" style="height: 65%;"></v-row>
			<v-row class="ma-0" style="height: 15%;" align="end">
				<v-col cols="12" align="right" class="pa-0">
					<v-btn
		 				:disabled="$store.getters.loading || !modified"
		 				:dark="$store.getters.loading || modified"
		 				:loading="$store.getters.loading"
		 				depressed
		 				tile block
		 				@click="save"
						color="teal">
						{{ $t('save') }}
					</v-btn>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import MonacoEditor from 'vue-monaco';
import yaml from 'js-yaml';

@Component({
	components: {
		MonacoEditor,
	},
})
export default class DashboardConfig extends Mixins(GlobalMixins) {
	public editor: any = {
		options: {
			automaticLayout: true,
		},
		language: 'yaml',
		code: '',
		theme: 'vs',
	};
	public originalCode: string = '';
	public readonly configFilePath: string = '_config.yml';

	get modified() {
		return this.originalCode !== this.editor.code;
	}

	public async created() {
		this.$logger.debug('app', 'DashboardConfig created');
		this.originalCode =
			this.editor.code =
			await this.$git.getContent<any>(this.configFilePath);
	}

	public change() {
		switch ( this.editor.language ) {
			case 'yaml':
				try {
					this.editor.code = yaml.dump(JSON.parse(this.editor.code));
					this.originalCode = yaml.dump(JSON.parse(this.originalCode));
				} catch {
					this.$noti({
						type: 'error',
						horizontal: 'right',
						vertical: 'top',
						content: this.$t('dashboard.config.dump-error'),
					});
					this.$nextTick(() => this.editor.language = 'json');
				}
				break;
			case 'json':
				try {
					this.editor.code = JSON.stringify(yaml.load(this.editor.code), null, '\t');
					this.originalCode = JSON.stringify(yaml.load(this.originalCode), null, '\t');
				} catch {
					this.$noti({
						type: 'error',
						horizontal: 'right',
						vertical: 'top',
						content: this.$t('dashboard.config.parse-error'),
					});
					this.$nextTick(() => this.editor.language = 'yaml');
				}
				break;
		}
	}

	public async save() {
		this.$store.commit('loading', true);
		let code = this.editor.code;
		if ( this.editor.language === 'json' ) {
			try {
				code = yaml.dump(JSON.parse(code));
			} catch {
				this.$noti({
					type: 'error',
					horizontal: 'right',
					vertical: 'top',
					content: this.$t('dashboard.config.dump-error'),
				});
				this.$store.commit('loading', false);
				return;
			}
		}
		await this.$git.clear();
		await this.$git.update(this.configFilePath, code);
		await this.$git.commit(`UPDATE: ${this.configFilePath}`);
		this.originalCode = this.editor.code;
		this.$store.commit('loading', false);
	}

}
</script>
<style scope>
.editor {
	width: 100%;
	height: 100%;
}
.editor > .monaco-editor {
	margin: 0;
	width: 100% !important;
	/* padding-top: 7px; */
}
.editor > .monaco-editor > .overflow-guard {
	margin: 0;
	width: 100% !important;
}
</style>
