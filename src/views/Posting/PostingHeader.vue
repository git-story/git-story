<!--
 * Header.vue
 * Created on Thu Apr 01 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-app-bar
		elevation="2"
		color="indigo lighten-3">
		<v-app-bar-nav-icon color="white"/>
		<v-toolbar-title>
			<router-link style="text-decoration: none" class="white--text" to="#">
				GIT STORY
			</router-link>
		</v-toolbar-title>

		<v-spacer />

		<v-btn tile elevation="1"
			:loading="tempPostLoading"
			color="teal--text text--darken-3 white"
			@click="postSave">
			{{ $t('posting.temp-save') }}
		</v-btn>

		<v-menu
	  		content-class="mt-6 elevation-2"
			bottom
	 		left
	 		rounded="0"
			transition="slide-y-transition"
			offset-y>
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					tile icon
					elevation="1"
					color="teal darken-3"
					class="mr-3"
					style="height: 36px; width: 36px; background: white;"
					v-bind="attrs"
					v-on="on">
					<v-icon> mdi-menu-down </v-icon>
				</v-btn>
			</template>

			<v-card tile elevation="1">
				<v-list flat>
					<v-list-item-group
		 				v-if="tempPosts.length > 0"
		 				v-model="selectedPostIdx"
	   					color="indigo">
						<v-list-item
							v-for="(post, i) in tempPosts"
		  					@click="selectTempPost(i)"
							:key="post.id">
							<v-list-item-content>
								<v-list-item-title v-text="post.title || $t('posting.untitle')"></v-list-item-title>
								<v-list-item-subtitle
									class="blue-grey--text text--lighten-2 mt-2"
		 							v-text="post.content.replace(/\\n/g, ' ').substr(0, 20)"/>
							</v-list-item-content>
							<v-list-item-action>
								<v-list-item-action-text v-text="dateFormat(post.updated)" />
								<v-btn class="mt-1" icon color="red" @click.stop="deleteTempPost(i)">
									<v-icon>mdi-delete</v-icon>
								</v-btn>
							</v-list-item-action>
						</v-list-item>
					</v-list-item-group>
					<v-list-item v-else>
						<v-list-item-content>
							<v-list-item-title v-text="$t('posting.not-have')"></v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-card>
		</v-menu>

		<v-menu
			content-class="mt-6 elevation-2"
			bottom left
			rounded="0"
			transition="slide-y-transition"
			nudge-width="800px"
	  		:close-on-content-click="false"
			offset-y>
			<template v-slot:activator="{ on, attrs }">
				<v-btn tile dark
					elevation="1"
					color="teal darken-3"
	 				v-bind="attrs"
					v-on="on">
					{{ $t('posting.posting') }}
				</v-btn>
			</template>
			<upload-menu
				:value="postConfig"
				@cover="selectCover"
				@upload="posting"
				@update="postConfig = $event"/>
		</v-menu>
	</v-app-bar>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import {
	TempPost,
	TempPostImage,
	PostConfig,
} from '@/interface/service';
import moment from 'moment';
import Markdown from '@git-story/md-editor/src/common/markdown/markdown.js';
import yaml from 'js-yaml';
import mime from 'mime-types';
import path from 'path';
import UploadMenu from './UploadMenu.vue';

// https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url
function validateUrl(value) {
	return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

function parseB64URL(b64) {
	const data = b64.match(/^data:(.*)?;(?:base64,)?(.*)/);
	if ( data.length !== 3 ) {
		throw Error('This is not base64 url');
	}
	return {
		contentType: data[1],
		data: data[2],
	};
}

function fileToBase64(input: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (evt) => {
			const { data } = parseB64URL(evt?.target?.result);
			resolve(data);
		};
		reader.readAsDataURL(input);
	});
}

function blobToBase64(url) {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(url);
		const reader = new FileReader();
		reader.onloadend = () => {
			resolve(reader.result);
		};
		reader.readAsDataURL(await res.blob());
	});
}

async function buildMarkdown(md: Markdown) {
	const splMd = md.text.split('\n');
	const images = md.images();
	for ( const img of images ) {
		if ( img.url.startsWith('blob:') ) {
			const b64img = await blobToBase64(img.url);
			const repl = splMd[img.line].replace(/!\[(.*?)\]\((.+?)\)/, `![$1](${b64img})`);
			md.replaceLine(img.line, repl);
		}
	}
	return md.text;
}

@Component({
	components: {
		UploadMenu,
	},
})
export default class Header extends Mixins(GlobalMixins) {

	public tempPosts: TempPost[] = [];
	public tempPostLoading: boolean = false;
	public selectedPostIdx: number = -1;
	public postConfig: PostConfig = {
		cover: '',
		tags: [],
		uploadType: 'jsdelivr',
	};
	public imgFile!: File;
	public config!: any; // _config.yml

	public async mounted() {
		this.tempPosts = this.$local.read<TempPost[]>('temp_posting', JSON.parse) as TempPost[] || [];
		this.$logger.debug('post', 'Temp post list', this.tempPosts);
		this.postConfig = {
			cover: '',
			tags: [],
			uploadType: 'jsdelivr',
		};
		this.$store.commit('title', '');
		this.$store.commit('markdown', '');
		do {
			this.config = await this.$git.getContent<any>('_config.yml', 'yaml');
			await this.$sleep(1000);
		} while ( !this.config );

		const href = this.$route.params.href;
		if ( href ) {
			let content = await this.$git.getContent<any>(href);
			const header = content.replace(/---\n((?:.*\n)*)?---\n(?:(?:.*\n?)*)/g, '$1');
			content = content.replace(/---\n(?:(?:.*\n)*)?---\n((?:.*\n?)*)/g, '$1');
			this.postConfig = yaml.load(header);
			this.postConfig.uploadType = 'jsdelivr';
			const md = new Markdown(content);
			const splMd = md.text.split('\n');
			const imgs = md.images();

			for ( const img of imgs ) {
				if ( img.url.startsWith('blob:') ) {
					// empty
				} else if ( img.url.startsWith('data:') ) {
					// empty
				} else {
					if ( !validateUrl(img.url) ) {
						img.url = `https://${path.join(this.$git.repo.name, img.url)}`;
						const repl = splMd[img.line].replace(/!\[(.*?)\]\((.+?)\)/, `![$1](${img.url})`);
						md.replaceLine(img.line, repl);
					}
				}
			}
			content = md.text;

			this.$store.commit('title', this.postConfig.title);
			this.$store.commit('markdown', content);
		}
		this.$store.commit('loading', false);
	}

	public postSave() {
		this.tempPostLoading = true;
		this.$evt.$emit('post:temp.save', (post: TempPost) => {
			const idx = this.tempPosts.findIndex((p: TempPost) => p.title === post.title);
			if ( idx >= 0 ) {
				this.tempPosts[idx] = post;
			} else {
				this.tempPosts.push(post);
			}
			this.$local.write('temp_posting', this.tempPosts);
			this.tempPostLoading = false;
		});
	}

	public dateFormat(dstr: string) {
		const date = new Date(dstr);
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		return `${year}. ${month}. ${day}`;
	}

	public deleteTempPost(idx: number) {
		this.tempPosts.splice(idx, 1);
		this.$local.write('temp_posting', this.tempPosts);
	}

	public selectTempPost(idx: number) {
		this.selectedPostIdx = -1;
		this.$evt.$emit('post:temp.set', this.tempPosts[idx]);
	}

	public async posting(post: TempPost, category: any) {

		// 제목 설정
		this.postConfig.title = post.title;

		// 태그 설정
		const tags = this.postConfig.tags as string[];
		if ( tags && tags.length === 0 ) {
			delete this.postConfig.tags;
		}

		// 카테고리 설정
		if ( category && category.text ) {
			this.postConfig.categories = [...category.dep, category.value];
		}

		if ( this.postConfig.date ) {
			this.postConfig.updated = moment().format('YYYY-MM-DD HH:mm:ss');
			await this.updatePosting.call(this, post);
		} else {
			this.postConfig.date = moment().format('YYYY-MM-DD HH:mm:ss');
			await this.newPosting.call(this, post);
		}

		// 임시 저장 삭제
		const idx = this.tempPosts.findIndex((p: TempPost) => p.title === post.title);
		if ( idx > -1 ) {
			this.tempPosts.splice(idx, 1);
			this.$local.write('temp_posting', this.tempPosts);
		}

		await this.$git.clear();
		this.$store.commit('loading', false);
		this.$assign('/dashboard');

	}

	public selectCover(file: File) {
		this.imgFile = file;
		this.postConfig.cover = this.imgFile.name;
	}

	private async newPosting(post: TempPost) {
		const date = this.postConfig.date as string;
		const dateStr = date.replace(/[-:\s]/g, '');
		const imgDir = `/images/${dateStr}`;
		let cover = this.postConfig.cover as string;
		cover = cover.trim();

		if ( cover ) {
			if ( this.imgFile && this.imgFile.name === cover ) {
				const b64Data = await fileToBase64(this.imgFile);
				const imgUrl = path.join(imgDir, this.imgFile.name);
				this.$git.add(path.join(this.config.source_dir, imgUrl), b64Data, 'base64');
				cover = imgUrl;
			} else {
				if ( !validateUrl(cover) ) {
					const imgUrl = path.join(this.config.source_dir, cover);
					if ( !this.$git.exists(imgUrl) ) {
						// throw Error
						this.$modal({
							type: 'error',
							title: this.$t('posting.upload-error'),
							content: this.$t('posting.cover-url-invalid'),
							textOk: this.$t('confirm'),
						}).then((close) => close());
						this.$store.commit('loading', false);
						return;
					}
				}
			}
		}

		this.postConfig.cover = cover;

		let content = '';

		const uploadType = this.postConfig.uploadType;
		const md = new Markdown(post.content);
		const splMd = md.text.split('\n');
		if ( uploadType === 'base64' ) {
			content += await buildMarkdown(md);
		} else if ( uploadType === 'github' || uploadType === 'jsdelivr' ) {
			const imgs = md.images();
			for ( let i = 0; i < imgs.length; i++ ) {
				const img = imgs[i];
				if ( img.url.startsWith('blob:') ) {
					const b64url = await blobToBase64(img.url);
					const { data, contentType } = parseB64URL(b64url);
					const imgName = img.alt.replace(/\s/g, '_');
					let imagePath = `${imgDir}/${imgName}.${mime.extension(contentType)}`;
					this.$git.add(`${this.config.source_dir}${imagePath}`, data, 'base64');

					if ( uploadType === 'jsdelivr' ) {
						imagePath = `https://cdn.jsdelivr.net/gh/${this.$git.repo.full_name}/${this.config.public_dir}${imagePath}`;
					}

					const repl = splMd[img.line].replace(/!\[(.*?)\]\((.+?)\)/, `![$1](${imagePath})`);
					md.replaceLine(img.line, repl);
					imgs[i].url = imagePath;
				}
			}

			// Set cover if don't have cover
			if ( !this.postConfig.cover ) {
				if ( imgs.length > 0 ) {
					this.postConfig.cover = imgs[0].url;
				}
			}

			content += md.text;
		}

		content =
			'---\n' +
			yaml.dump(this.postConfig) +
			'---\n' +
			content;

		let title = this.postConfig.title as string;
		title = title.replace(/\s/g, '_');

		const fileName = `${this.config.source_dir}/_posts/${dateStr}_${title}.md`;
		this.$git.add(fileName, content);

		await this.$git.workflowClear();
		await this.$git.commit(`POST: ${post.title}`);
	}

	private async updatePosting(post: TempPost) {
		const date = this.postConfig.date as string;
		const dateStr = date.replace(/[-:\s]/g, '');
		const imgDir = `/images/${dateStr}`;
		let cover = this.postConfig.cover as string;


		if ( cover.trim() ) {
			if ( this.imgFile && this.imgFile.name === cover ) {
				// newPosting 함수와 내용이 다르다.
				const b64Data = await fileToBase64(this.imgFile);
				const imgUrl = path.join(imgDir, this.imgFile.name);
				const fullPath = path.join(this.config.source_dir, imgUrl);

				if ( this.$git.exists(fullPath) ) {
					this.$git.update(fullPath, b64Data, 'base64');
				} else {
					this.$git.add(fullPath, b64Data, 'base64');
				}
				cover = imgUrl;
			} else {
				if ( !validateUrl(cover) ) {
					const imgUrl = path.join(this.config.source_dir, cover);
					if ( !this.$git.exists(imgUrl) ) {
						// throw Error
						this.$modal({
							type: 'error',
							title: this.$t('posting.upload-error'),
							content: this.$t('posting.cover-url-invalid'),
							textOk: this.$t('confirm'),
						}).then((close) => close());
						this.$store.commit('loading', false);
						return;
					}
				}
			}
		}

		this.postConfig.cover = cover;

		let content = '';

		const uploadType = this.postConfig.uploadType;
		const md = new Markdown(post.content);
		const splMd = md.text.split('\n');
		if ( uploadType === 'base64' ) {
			content += await buildMarkdown(md);
		} else if ( uploadType === 'github' || uploadType === 'jsdelivr' ) {
			const imgs = md.images();
			for ( let i = 0; i < imgs.length; i++ ) {
				const img = imgs[i];
				if ( img.url.startsWith('blob:') ) {
					const b64url = await blobToBase64(img.url);
					const { data, contentType } = parseB64URL(b64url);
					const imgName = img.alt.replace(/\s/g, '_');
					let imagePath = `${imgDir}/${imgName}.${mime.extension(contentType)}`;

					const fullPath = path.join(this.config.source_dir, imagePath);

					if ( this.$git.exists(fullPath) ) {
						this.$git.update(fullPath, data, 'base64');
					} else {
						this.$git.add(fullPath, data, 'base64');
					}

					if ( uploadType === 'jsdelivr' ) {
						imagePath = `https://cdn.jsdelivr.net/gh/${this.$git.repo.full_name}/${this.config.public_dir}${imagePath}`;
					}

					const repl = splMd[img.line].replace(/!\[(.*?)\]\((.+?)\)/, `![$1](${imagePath})`);
					md.replaceLine(img.line, repl);
					imgs[i].url = imagePath;
				}
			}

			// Set cover if don't have cover
			if ( !this.postConfig.cover ) {
				if ( imgs.length > 0 ) {
					this.postConfig.cover = imgs[0].url;
				}
			}

			content += md.text;
		}

		content =
			'---\n' +
			yaml.dump(this.postConfig) +
			'---\n' +
			content;

		this.$logger.debug('posting', 'Update content to ', this.$route.params.href, content);
		this.$git.update(this.$route.params.href, content);

		await this.$git.workflowClear();
		await this.$git.commit(`UPDATE POST: ${this.$route.params.href}`);
		await this.$git.clear();
	}

}
</script>
