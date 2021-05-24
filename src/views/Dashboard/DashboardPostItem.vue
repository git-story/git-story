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
							<v-btn color="red" dark class="mr-4" tile depressed>
								{{ $t('remove') }}
							</v-btn>
							<v-btn color="indigo" dark tile depressed>
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

@Component()
export default class DashboardPostItem extends Mixins(GlobalMixins) {

	@Prop(MetaData) public post!: MetaData;

	public defaultImage: string = 'https://cdn.pixabay.com/photo/2017/07/25/01/22/cat-2536662_960_720.jpg';

	public openPost() {
		window.open(`https://${this.$git.repo.name}/${this.post.href}`);
	}

}
</script>
