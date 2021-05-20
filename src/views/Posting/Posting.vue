<!--
 * Posting.vue
 * Created on Thu Apr 01 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-main style="overflow: hidden;">
		<Header />
		<v-row class="mx-0" style="background-color: #f2f4f7; height: calc(100vh - 64px); overflow-y: auto;">
			<v-col class="d-none d-sm-block py-0" sm="1"  md="2" lg="3"></v-col>
			<v-col class="py-0" cols="12" sm="10" md="8" lg="6">
				<v-row style="background-color: white; height: 100%;" class="ma-0 editor-shadow">
					<v-col cols="12">
						<v-row class="ma-0 pt-5 px-5">
							<v-col cols="12">
								<input v-model="postTitle" type="text" class="title-input" spellcheck="false" :placeholder="$t('title')">
							</v-col>
						</v-row>
						<v-divider class="mx-8" />
						<v-row class="mx-0 pt-4 px-6" style="height: 85%; cursor: text;" @click="editorFocusEnd">
							<v-col cols="12">
								<div @click.stop="">
									<MarkdownEditor ref="editor" v-model="markdown" :settings="mdOptions"/>
								</div>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
			</v-col>
			<v-col class="d-none d-sm-block py-0" sm="1"  md="2" lg="3"></v-col>
		</v-row>
	</v-main>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import MarkdownEditor from '@git-story/md-editor';
import Markdown from '@git-story/md-editor/src/common/markdown/markdown.js';
import Header from './PostingHeader.vue';
import { TempPost, TempPostImage } from '@/interface/service';

@Component({
	components: {
		MarkdownEditor,
		Header,
	},
})
export default class Posting extends Mixins(GlobalMixins) {

	public markdown: string = this.$t('content');
	public mdOptions: Record<string, unknown> = {
		images: {
			enabled: true,
		},
	};
	public postTitle: string = '';

	public mounted() {
		this.$logger.debug('app', 'Posting mounted');
		this.$evt.$on('post:temp.save', async (end: (post: TempPost) => void) => {
			const md = new Markdown(this.markdown);
			const editor = this.$refs.editor as any;
			const imgs = md.images();
			const post: TempPost = {
				title: this.postTitle || '',
				content: '',
				updated: new Date().toJSON(),
				imgs: [],
			};

			for ( let idx = 0; idx < imgs.length; idx++ ) {
				const img = imgs[idx];
				if ( img.url.startsWith('blob:') ) {
					const b64data = await editor.blobToBase64(img.url);
					const name = img.alt;
					const id = `${name}...${idx}`;

					post.imgs.push({
						id,
						name,
						b64data,
					} as TempPostImage);

					md.replaceLine(img.line, `![${id}](${b64data})`);
				}
			}

			post.content = md.text;
			end(post);
		});
	}

	public editorFocusEnd() {
		const editor = this.$refs.editor as any;
		editor.focus();
		editor.focusEnd();
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
.editor-shadow {
	-webkit-box-shadow: 0px 0px 18px 2px rgba(173,173,173,1);
	-moz-box-shadow: 0px 0px 18px 2px rgba(173,173,173,1);
	box-shadow: 0px 0px 18px 2px rgba(173,173,173,1);
}
</style>
