<!--
 * DashboardPostItem.vue
 * Created on Mon May 24 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-hover style="cursor: pointer;">
		<template v-slot:default="{ hover }">
			<v-card tile :elevation="hover ? 12 : 1" @click="openPost">
				<v-img
					height="250"
	 				lazy-src="https://cdn.pixabay.com/photo/2015/02/22/17/56/loading-645268_640.jpg"
					:src="post.cover || defaultImage">
				</v-img>

				<v-card-title>{{ post.title }}</v-card-title>
				<v-card-text class="pt-0">
					<v-row align="center" class="ma-0">
						<div>{{ post.content }}</div>
					</v-row>
				</v-card-text>

				<v-divider class="mx-4"></v-divider>

				<v-card-actions>
					<v-row>
						<v-col cols="12" align="right" class="pr-6">
							<v-btn color="red" dark class="mr-4" tile depressed @click.stop="remove">
								{{ $t('remove') }}
							</v-btn>
							<v-btn color="indigo" dark tile depressed @click.stop="modify">
								{{ $t('modify') }}
							</v-btn>
						</v-col>
					</v-row>
				</v-card-actions>
			</v-card>
		</template>
	</v-hover>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { MetaData } from '@/interface/service';
import path from 'path';

function date2str(date: Date) {
	const yyyy = date.getUTCFullYear();
	const MM = (date.getUTCMonth() + 1).toString().padStart(2, '0');
	const dd = date.getUTCDate().toString().padStart(2, '0');
	const hh = date.getUTCHours().toString().padStart(2, '0');
	const mm = date.getUTCMinutes().toString().padStart(2, '0');
	const ss = date.getUTCSeconds().toString().padStart(2, '0');

	return `${yyyy}${MM}${dd}${hh}${mm}${ss}`;
}

@Component({})
export default class DashboardPostItem extends Mixins(GlobalMixins) {

	@Prop(Object) public post!: MetaData;
	@Prop(Object) public config!: any;

	public defaultImage: string = 'https://cdn.pixabay.com/photo/2017/07/25/01/22/cat-2536662_960_720.jpg';

	private MAX_RETRY_CNT: number = 5;

	public openPost() {
		window.open(`https://${this.$git.repo.name}/${this.post.href}`);
	}

	public remove() {
		this.$confirm({
			type: 'warning',
			title: this.$t('dashboard.blog.remove'),
			content: this.$t('dashboard.blog.remove-desc'),
			textOk: this.$t('yes'),
			textCancel: this.$t('cancel'),
		}).then(async (close) => {
			const imgDir = path.join(this.config.source_dir, 'images', date2str(new Date(this.post.date)));
			await this.$git.workflowClear();
			let i = 0;

			while ( i++ < this.MAX_RETRY_CNT ) {
				try {
					await this.$git.remove(this.post.src);
					await this.$git.remove(imgDir);
					await this.$git.commit(`REMOVE: ${this.post.title}`);
					i = 0;
					break;
				} catch (err) {
					this.$logger.warn('github', err);
					await this.$sleep(1500);
					await this.$git.clear();
					await this.$sleep(1500);
				}
			}

			if ( i >= this.MAX_RETRY_CNT ) {
				throw Error('File remove max try fail.');
			}

			this.$emit('remove');

			await this.$git.clear();

			close();
		}).catch((close) => {
			if ( typeof close === 'function' ) {
				close();
			} else {
				throw close;
			}
		});
	}

	public modify() {
		this.$assign(`/posting/${this.post.src}`);
	}

}
</script>
