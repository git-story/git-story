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
			<v-row class="ma-0" style="height: 50%;">
			</v-row>
			<v-row class="ma-0" style="height: 50%;" align="end">
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

	public async save() {
		this.$store.commit('loading', true);
		await this.$git.clear();
		await this.$git.update([
			{
				path: this.configFilePath,
				blob: {
					content: this.editor.code,
					encoding: 'utf-8',
				},
			},
		], `UPDATE: ${this.configFilePath}`);
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
