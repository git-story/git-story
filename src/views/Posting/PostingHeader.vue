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

			<v-card tile elevation="1" width="500px">
				<!-- S: Select Cover Image -->
				<v-row class="ma-0 px-3 pt-3" align="center">
					<v-col cols="3">
						<h5>{{ $t('posting.cover') }}</h5>
					</v-col>
					<v-col cols="7">
						<v-text-field v-model="postConfig.cover" />
					</v-col>
					<v-col cols="2">
						<v-file-input
		  					accept="image/*"
		  					class="pa-0"
							prepend-icon="mdi-image"
							hide-input
							@change="selectCover"/>
					</v-col>
				</v-row>
				<!-- E: Select Cover Image -->
				<!-- S: Tag -->
				<v-row class="ma-0 px-3" align="center">
					<v-col cols="3">
						<h5>{{ $t('posting.tag') }}</h5>
					</v-col>
					<v-col cols="9">
						<v-combobox
		  					v-model="postConfig.tags"
		 					class="custom"
							:label="$t('posting.tag-label')"
		 					color="indigo darken-3"
		 					chips clearable
		 					multiple dense>
							<template v-slot:selection="{ attrs, item, select, selected }">
								<v-chip
									small
									v-bind="attrs"
									:input-value="selected"
		 							close
									@click:close="removeItem(postConfig.tags, item)">
									{{ item }}
								</v-chip>
							</template>
						</v-combobox>
					</v-col>
				</v-row>
				<!-- E: Tag -->
				<v-row class="ma-0 px-3">
					<v-col cols="3">
						<h5>{{ $t('posting.image-upload.type') }}</h5>
					</v-col>
					<v-col cols="9">
						<v-radio-group
		  					v-model="postConfig.uploadType"
							row>
							<v-radio label="Github" value="github" color="indigo"></v-radio>
							<!-- <v-radio label="Base64" value="base64" color="indigo"></v-radio> -->
							<!-- <v-radio label="Imgur" value="imgur"></v-radio> -->
						</v-radio-group>
					</v-col>
				</v-row>
				<!-- S: Upload Button -->
				<v-row class="ma-0 px-3 pb-3">
					<v-col cols="12">
						<v-btn
							block dark
							color="indigo darken-1"
							@click="posting">{{ $t('posting.upload') }}</v-btn>
					</v-col>
				</v-row>
				<!-- E: Upload Button -->
			</v-card>
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Component({
	components: {
	},
})
export default class Header extends Mixins(GlobalMixins) {

	public tempPosts: TempPost[] = [];
	public tempPostLoading: boolean = false;
	public selectedPostIdx: number = -1;
	public postConfig: PostConfig = {
		cover: '',
		tags: [],
		uploadType: 'github',
	};
	public imgFile!: File;
	public config!: any; // _config.yml

	public async mounted() {
		this.tempPosts = this.$local.read<TempPost[]>('temp_posting', JSON.parse) as TempPost[] || [];
		this.$logger.debug('post', 'Temp post list', this.tempPosts);
		do {
			try {
				this.config = await this.$git.getContent<any>('_config.yml', 'yaml');
				await sleep(1000);
			} catch {
				// error
			}
		} while ( !this.config );
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

	public posting() {
		this.$evt.$emit('app:loading', true);
		this.$evt.$emit('post:get', async (post: TempPost) => {

			// 최신 정보 갱신
			await this.$git.clear();

			if ( post.title.length === 0 ) {
				try {
					const close = await this.$confirm({
						type: 'warning',
						title: this.$t('posting.warning-untitle'),
						content: this.$t('posting.keep-upload'),
						textOk: this.$t('yes'),
						textCancel: this.$t('no'),
					});
					close();
					post.title = `${this.$t('posting.untitle')}_${moment().format('YYYY-MM-DD')}`;
				} catch (close) {
					close();
					return;
				}
			}

			if ( this.postConfig.cover?.trim() ) {
				if ( this.imgFile && this.imgFile.name === this.postConfig.cover ) {
					const b64Data = await fileToBase64(this.imgFile);
					const imgUrl = `/images/${this.imgFile.name}`;
					this.$git.add(this.config.source_dir + imgUrl, b64Data, 'base64');
					this.postConfig.cover = imgUrl;
				} else {
					if ( !validateUrl(this.postConfig.cover) ) {
						// throw Error
						this.$modal({
							type: 'error',
							title: this.$t('posting.upload-error'),
							content: this.$t('posting.cover-url-invalid'),
							textOk: this.$t('confirm'),
						}).then((close) => close());
						return;
					}
				}
			}

			this.postConfig.title = post.title;

			const tags = this.postConfig.tags as string[];
			const uploadType = this.postConfig.uploadType;
			delete this.postConfig.uploadType;
			if ( tags && tags.length === 0 ) {
				delete this.postConfig.tags;
			}

			if ( this.postConfig.date ) {
				this.postConfig.updated = moment().format('YYYY-MM-DD HH:mm:ss');
			} else {
				this.postConfig.date = moment().format('YYYY-MM-DD HH:mm:ss');
			}
			let content = '';
			content += '---\n';
			content += yaml.dump(this.postConfig);
			content += '---\n';

			const dateStr = this.postConfig.date.replace(/[-:\s]/g, '');

			const md = new Markdown(post.content);
			const splMd = md.text.split('\n');
			if ( uploadType === 'base64' ) {
				content += await buildMarkdown(md);
			} else if ( uploadType === 'github' ) {
				const imgs = md.images();
				const imgDir = dateStr;
				for ( const img of imgs ) {
					if ( img.url.startsWith('blob:') ) {
						const b64url = await blobToBase64(img.url);
						const { data, contentType } = parseB64URL(b64url);
						const imgName = img.alt.replace(/\s/g, '_');
						const imagePath = `/images/${imgDir}/${imgName}.${mime.extension(contentType)}`;
						const repl = splMd[img.line].replace(/!\[(.*?)\]\((.+?)\)/, `![$1](${imagePath})`);
						md.replaceLine(img.line, repl);
						this.$git.add(`${this.config.source_dir}${imagePath}`, data, 'base64');
					}
				}
				content += md.text;
			}

			this.$git.add(`${this.config.source_dir}/_posts/${dateStr}_${this.postConfig.title.replace(/\s/g, '_')}.md`, content);

			await this.$git.workflowClear();
			await this.$git.commit(`POST: ${post.title}`);
			await this.$git.clear();
			this.$evt.$emit('app:loading', false);
		});
	}

	public selectCover(file: File) {
		this.imgFile = file;
		this.postConfig.cover = this.imgFile.name;
	}

	public removeItem(arr: string[], item: string) {
		const idx = arr.findIndex((s: string) => s === item);
		arr.splice(idx, 1);
	}

}
</script>
<style scope>
.custom .v-text-field__details {
	display: none !important;
}
</style>
