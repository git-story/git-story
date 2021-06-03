<!--
 * UploadMenu.vue
 * Created on Wed Jun 02 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-card tile elevation="1" width="500px">
		<v-row class="ma-0 px-3 pt-3" align="center">
			<v-col cols="12" class="pb-0">
				<v-radio-group
					v-model="editMode"
	 				class="custom ma-0"
	  				@change="editModeChange"
	 				row>
					<v-radio
		 				label="Basic"
	   					value="basic"
						color="indigo"></v-radio>
					<v-radio
		 				label="Editor"
	   					value="editor"
						color="indigo"></v-radio>
				</v-radio-group>
			</v-col>
		</v-row>
		<div v-if="editMode === 'editor'">
			<v-row class="ma-0 px-3" align="center" style="min-height: 300px;">
				<v-col cols="12">
					<monaco-editor
						ref="code-editor"
	  					style="width: 100%; height: 300px; border: solid black 1px;"
						v-model="editor.code"
						:language="editor.language"
						:theme="editor.theme"
						:options="editor.options"/>
				</v-col>
			</v-row>
		</div>
		<div v-else>
			<!-- S: Select Cover Image -->
			<v-row class="ma-0 px-3" align="center">
				<v-col cols="3">
					<h5>{{ $t('posting.cover') }}</h5>
				</v-col>
				<v-col cols="7">
					<v-text-field v-model="value.cover" />
				</v-col>
				<v-col cols="2">
					<v-file-input
						accept="image/*"
						class="pa-0"
						prepend-icon="mdi-image"
						hide-input
						@change="$emit('cover', $event)"/>
				</v-col>
			</v-row>
			<!-- E: Select Cover Image -->
			<!-- S: Category -->
			<v-row class="ma-0 px-3" align="center">
				<v-col cols="3">
					<h5>{{ $t('posting.category') }}</h5>
				</v-col>
				<v-col cols="9">
					<v-select
						v-if="categoryRenderer"
						v-model="category"
						:items="categories"
						item-text="text"
						return-object
						menu-props="auto"
						:label="$t('posting.category')"
						color="indigo darken-3"
						dense>
					</v-select>
				</v-col>
			</v-row>
			<!-- E: Category -->
			<!-- S: Tag -->
			<v-row class="ma-0 px-3" align="center">
				<v-col cols="3">
					<h5>{{ $t('posting.tag') }}</h5>
				</v-col>
				<v-col cols="9">
					<v-combobox
						v-model="value.tags"
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
								@click:close="removeItem(value.tags, item)">
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
						v-model="value.uploadType"
						row>
						<v-radio label="Github" value="github" color="indigo"></v-radio>
						<!-- <v-radio label="Base64" value="base64" color="indigo"></v-radio> -->
						<!-- <v-radio label="Imgur" value="imgur"></v-radio> -->
					</v-radio-group>
				</v-col>
			</v-row>
		</div>
		<!-- S: Upload Button -->
		<v-row class="ma-0 px-3 pb-3">
			<v-col cols="12">
				<v-btn
					block dark
					color="indigo darken-1"
					@click="upload">{{ $t('posting.upload') }}</v-btn>
			</v-col>
		</v-row>
		<!-- E: Upload Button -->
	</v-card>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { DataTree, TempPost } from '@/interface/service';
import moment from 'moment';
import MonacoEditor from 'vue-monaco';
import yaml from 'js-yaml';

function dump(arr: DataTree[], dep: number = 0, parent: any = []) {
	let ret: any[] = [];
	for ( const item of arr ) {
		let str = '';
		if ( dep > 0 ) {
			str += '　'.repeat(dep - 1);
			str += '↳ ';
		}
		str += item.text;
		ret.push({
			text: str,
			value: item.text,
			dep: parent,
		});
		if ( Array.isArray(item.children) && item.children.length > 0 ) {
			const sub = dump(item.children, dep + 1, [...parent, item.text]);
			ret = ret.concat(sub);
		}
	}
	return ret;
}

@Component({
	components: {
		MonacoEditor,
	},
})
export default class UploadMenu extends Mixins(GlobalMixins) {

	@Prop(Object) public value!: any;

	public categories: any[] = [];
	public category: any = {};
	public categoryRenderer: boolean = false;
	public editMode: string = 'basic';

	public editor: any = {
		options: {
			automaticLayout: true,
		},
		language: 'yaml',
		code: '',
		theme: 'vs',
	};

	public async mounted() {
		this.$logger.debug('app', 'UploadMenu Mounted');
		const tmp = await this.$git.getContent<DataTree[]>('categories.json', 'json') as DataTree[];
		this.categories = dump(tmp);
		this.category = this.categories[0];
		this.categoryRerender();
		this.$logger.debug('post', 'Category list', this.categories);
	}

	public editModeChange() {
		if ( this.editMode === 'editor' ) {
			this.editor.code = yaml.dump(this.value);
		} else {
			this.$emit('update', yaml.load(this.editor.code));
		}
	}

	public categoryRerender() {
		this.categoryRenderer = false;
		this.$nextTick(() => {
			this.categoryRenderer = true;
		});
	}

	public removeItem(arr: string[], item: string) {
		const idx = arr.findIndex((s: string) => s === item);
		arr.splice(idx, 1);
	}

	public upload() {
		this.$store.commit('loading', true);
		this.$evt.$emit('post:get', async (post: TempPost) => {

			// 제목 검사
			if ( post.title.length === 0 ) {
				try {
					const close = await this.$confirm({
						type: 'warning',
						title: this.$t('posting.warning-untitle'),
						content: this.$t('posting.keep-upload'),
						textOk: this.$t('yes'),
						textCancel: this.$t('no'),
					});
					post.title = `${this.$t('posting.untitle')}_${moment().format('YYYY-MM-DD')}`;
					close();
				} catch (close) {
					close();
					this.$store.commit('loading', false);
					return;
				}
			}

			// workflow clear
			await this.$git.workflowClear();

			// 최신 정보 갱신
			await this.$git.clear();

			if ( this.editMode === 'editor' ) {
				this.$emit('update', yaml.load(this.editor.code));
				await this.$sleep(10);
			}
			this.$emit('upload', post, this.category);

		});
	}

}
</script>
