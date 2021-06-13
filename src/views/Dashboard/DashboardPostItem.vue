<!--
 * DashboardPostItem.vue
 * Created on Mon May 24 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-hover style="cursor: pointer;">
		<template v-slot:default="{ hover }">
			<v-card
	   			shaped
	   			:class="hover ? 'grey lighten-4' : 'white'"
				@click="openPost"
	   			:elevation="hover ? 4 : 0"
			   	:style="hover ? { zIndex: 4 } : {}">
				<div class="d-flex flex-no-wrap justify-space-between">
					<v-avatar
						class="ma-3"
						size="125"
						style="border-radius: 0.5rem;">
						<v-img
							height="250"
							lazy-src="https://cdn.pixabay.com/photo/2015/02/22/17/56/loading-645268_640.jpg"
							:src="post.cover || defaultImage">
						</v-img>
					</v-avatar>

					<div style="width: 100%;">
						<v-card-title>
							<span :title="post.title" class="font-weight-bold">
								{{ title(post.title) }}
							</span>
							<v-spacer></v-spacer>

							<v-menu
								open-on-hover left
								content-class="elevation-0"
								tile
								:close-on-content-click="false">
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										icon small
										v-bind="attrs"
		  								:color="hover ? 'grey' : 'grey lighten-2'"
		  								plain
										v-on="on">
										<v-icon>mdi-dots-vertical</v-icon>
									</v-btn>
								</template>

								<v-list class="pa-0" :elevation="0">
									<v-list-item class="pa-0" style="min-height: 10px;">
										<v-btn
											text tile
											color="green"
											dark depressed plain
											@click.stop="modify">
											{{ $t('modify') }}
										</v-btn>
										<v-btn
											text tile
											color="red"
											dark depressed plain
											@click.stop="remove">
											{{ $t('remove') }}
										</v-btn>
									</v-list-item>
								</v-list>

							</v-menu>
						</v-card-title>
						<v-card-text class="pt-0" style="min-height: 80px;">
							<v-row align="center" class="ma-0">
								<div>{{ post.content }}</div>
							</v-row>
						</v-card-text>

						<!--
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
						-->
					</div>
				</div> <!-- Flex Justify -->
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
	@Prop(Array) public metaData!: MetaData[];

	public defaultImage: string = 'https://cdn.pixabay.com/photo/2017/07/25/01/22/cat-2536662_960_720.jpg';

	// issue https://github.com/prose/prose/issues/148
	// Referring to the issue, repeat for at least 30 seconds.
	private MAX_RETRY_CNT: number = 11;

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
			let i = 0;

			const midx = this.metaData.findIndex((m: MetaData) => this.post.title === m.title);
			if ( midx > -1 ) {
				this.metaData.splice(midx, 1);
			}

			while ( i++ < this.MAX_RETRY_CNT ) {
				try {
					await this.$git.update('meta-data.json', JSON.stringify(this.metaData, null, '\t'));
					await this.$git.remove(this.post.src);
					await this.$git.remove(imgDir);
					await this.$git.commit(`REMOVE: ${this.post.title}`);
					i = 0;
					break;
				} catch (err) {
					this.$logger.warn('github', err);
					await this.$sleep(1500);
					await this.$git.workflowClear();
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

	public title(title: string) {
		if ( title.length > 8 ) {
			title = title.substr(0, 8) + '...';
		}
		return title;
	}

}
</script>
