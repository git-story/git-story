<!--
 * Posting.vue
 * Created on Thu Apr 01 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-row class="mx-0 vh-100" style="background-color: #f2f4f7;">
		<v-col class="d-none d-sm-block py-0" sm="1"  md="2" lg="3"></v-col>
		<v-col class="py-0" cols="12" sm="10" md="8" lg="6">
			<v-row style="background-color: white;" class="ma-0 h-100">
				<v-col cols="12">
					<v-row class="mx-0 pt-5 px-5">
						<v-col cols="12">
							<input type="text" class="title-input" spellcheck="false" :placeholder="$t('title')">
						</v-col>
					</v-row>
					<v-divider class="mx-8" />
					<v-row class="mx-0 pt-4 px-6" style="height: 90%; cursor: text;" @click="editorFocusEnd">
						<v-col cols="12">
							<MarkdownEditor ref="editor" v-model="markdown"/>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-col>
		<v-col class="d-none d-sm-block py-0" sm="1"  md="2" lg="3"></v-col>
	</v-row>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import MarkdownEditor from '@voraciousdev/vue-markdown-editor';

@Component({
	components: {
		MarkdownEditor,
	},
})
export default class Posting extends Mixins(GlobalMixins) {

	public markdown: string = this.$t('content');

	public mounted() {
		this.$logger.debug('app', 'Posting mounted');
	}

	public editorFocusEnd() {
		console.log('click', this.$refs.editor);
		this.$refs.editor.focus();
		this.$refs.editor.focusEnd();
	}

}
</script>
<style scoped>
.title-input {
	font-size: 2rem;
}
.title-input:focus {
	outline: none;
}
.editor-pending {
	cursor: text;
	min-height: 1rem;
	height: 2rem;
	width: 100%;
	flex-grow: 1;
}
</style>
