<!--
 * Posting.vue
 * Created on Thu Apr 01 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-main style="overflow: hidden; height: 100vh;">
		<Header />
		<v-row
			class="mx-0 mt-0"
			style="overflow-y: auto; height: calc(100vh - 64px);"
   			:style="$vuetify.theme.dark ?
   				{ background: '#252526', } :
				{ background: '#f2f4f7', }" >
			<v-col cols="12" md="6" class="white">
				<v-row class="ma-0 pt-5 px-5">
					<v-col cols="12">
						<input
							v-model="$store.state.title"
							type="text"
							class="title-input black--text"
							spellcheck="false"
							:placeholder="$t('title')">
					</v-col>
				</v-row>
				<v-divider class="mx-8" />
				<v-row class="mx-0 pt-4 px-6" style="height: 85%; cursor: text;" @click="editorFocusEnd">
					<v-col cols="12">
						<div @click.stop="">
							<MarkdownEditor
								ref="editor"
								v-model="$store.state.markdown"
								:theme="$vuetify.theme.dark ? 'dark' : 'light'"
								class="editor"
								:settings="mdOptions"/>
						</div>
					</v-col>
				</v-row>
			</v-col>
			<v-col cols="6" class="d-none d-md-flex">
				<div v-html="preview" class="mt-5 mx-5 w-100"></div>
			</v-col>
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
	beforeRouteLeave(to, from, next) {
		const $vue = this as any;
		const { $store } = $vue;
		console.log($store.getters.editing, $store.getters.title, $store.getters.markdown, $vue.$t('content'));
		console.log(($store.getters.title !== '' || $store.getters.markdown !== $vue.$t('content')));
		if ( $store.getters.editing &&
			($store.getters.title !== '' || $store.getters.markdown !== $vue.$t('content')) ) {
			$store.commit('editing', false);
			$vue.$confirm({
				title: $vue.$t('posting.exit-confirm.title'),
				content: $vue.$t('posting.exit-confirm.content'),
				type: 'warn',
				textOk: $vue.$t('exit'),
				textCancel: $vue.$t('cancel'),
			}).then((close) => {
				close();
				next();
			}).catch((close) => {
				close();
				next(false);
			});
		} else {
			$store.commit('editing', false);
			next();
		}
	},
})
export default class Posting extends Mixins(GlobalMixins) {

	public mdOptions: Record<string, unknown> = {
		images: {
			enabled: true,
		},
	};

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

	get preview() {
		const text = '# ' + this.$store.getters.title + '\n<br><br>\n' +
			this.$store.getters.markdown;
		return new Markdown(text).html;
	}

	public mounted() {
		this.$store.commit('loading', true);
		this.$store.commit('markdown', this.$t('content'));
		this.$store.commit('editing', true);

		this.$logger.debug('app', 'Posting mounted');
		this.$evt.$off('post:temp.save');
		this.$evt.$on('post:temp.save', async (end: EndFunction) => {
			const md = new Markdown(this.$store.getters.markdown);
			const splMd = md.text.split('\n');
			const editor = this.$refs.editor as any;
			const imgs = md.images();
			const post: TempPost = {
				title: this.$store.getters.title,
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
			this.$store.commit('title', post.title);
			const md = new Markdown(post.content);
			const editor = this.$refs.editor as any;
			const splMd = md.text.split('\n');
			for ( const img of post.imgs ) {
				const url = this.decompress(img.data.text, img.data.type);
				const regx = new RegExp(`<img:${img.id}>`);
				const repl = splMd[img.line].replace(regx, `![${img.name}](${url})`);
				md.replaceLine(img.line, repl);
			}
			this.$store.commit('markdown', md.text);
		});

		this.$evt.$off('post:get');
		this.$evt.$on('post:get', (end: EndFunction) => {
			const post = {
				title: this.$store.getters.title,
				content: this.$store.getters.markdown,
				updated: new Date().toJSON(),
				imgs: [],
			};
			end(post);
		});

		window.addEventListener('beforeunload', this.unLoadEvent);
	}

	public beforeDestroy() {
		window.removeEventListener('beforeunload', this.unLoadEvent);
	}

	public unLoadEvent(evt) {
		evt.preventDefault();
		evt.returnValue = '';
	}

	public editorFocusEnd() {
		const editor = this.$refs.editor as any;
		editor.focus();
		editor.focusEnd();
		editor.showToolbar();
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
.theme--dark .editor-shadow {
	-webkit-box-shadow: 0px 0px 18px 2px rgba(75,75,75,1);
	-moz-box-shadow: 0px 0px 18px 2px rgba(75,75,75,1);
	box-shadow: 0px 0px 18px 2px rgba(75,75,75,1);
}
</style>
