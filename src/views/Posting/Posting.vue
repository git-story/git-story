<!--
 * Posting.vue
 * Created on Thu Apr 01 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-main style="overflow: hidden; height: 100vh;">
		<Header />
		<v-row class="mx-0 mt-0" style="background-color: #f2f4f7; height: calc(100vh - 64px); overflow-y: auto;">
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
import { TempPost, TempPostImage, ImgData } from '@/interface/service';

type EndFunction = (post: TempPost) => void;
declare global {
	interface Window {
		LZString: any;
	}
}


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

	public async compress(url: string): Promise<ImgData> {
		const res = await fetch(url);
		const blob = await res.blob();
		const text = Buffer.from(new Uint8Array(await blob.arrayBuffer())).toString('hex');
		return {
			text: window.LZString.compressToUTF16(text),
			type: blob.type,
		};
	}

	public decompress(data: string, type: string): string {
		const text = window.LZString.decompressFromUTF16(data);
		const uint8array = Buffer.from(text, 'hex');
		const blob = new Blob([ uint8array ], { type });
		return URL.createObjectURL(blob);
	}

	public mounted() {
		this.$logger.debug('app', 'Posting mounted');
		this.$evt.$off('post:temp.save');
		this.$evt.$on('post:temp.save', async (end: EndFunction) => {
			const md = new Markdown(this.markdown);
			const splMd = md.text.split('\n');
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
					const data = await this.compress(img.url);
					const name = img.alt;
					const id = `${name}...${idx}`;

					post.imgs.push({
						id,
						name,
						data,
						line: img.line,
					} as TempPostImage);

					const repl = splMd[img.line].replace(/!\[(.*?)\]\((.+?)\)/, `<img:${id}>`);
					md.replaceLine(img.line, repl);
				}
			}

			post.content = md.text;
			end(post);
		});

		this.$evt.$off('post:temp.set');
		this.$evt.$on('post:temp.set', async (post: TempPost) => {
			this.postTitle = post.title;
			const md = new Markdown(post.content);
			const editor = this.$refs.editor as any;
			const splMd = md.text.split('\n');
			for ( const img of post.imgs ) {
				const url = this.decompress(img.data.text, img.data.type);
				const regx = new RegExp(`<img:${img.id}>`);
				const repl = splMd[img.line].replace(regx, `![${img.name}](${url})`);
				md.replaceLine(img.line, repl);
			}
			this.markdown = md.text;
		});

		this.$evt.$off('post:get');
		this.$evt.$on('post:get', (end: EndFunction) => {
			const post = {
				title: this.postTitle,
				content: this.markdown,
				updated: new Date().toJSON(),
				imgs: [],
			};
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
