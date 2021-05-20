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
				<v-list flat max-width="500px" width="80%">
					<v-list-item
						v-for="(post, i) in tempPosts"
						:key="post.id">
						<v-list-item-content>
							<v-list-item-title v-text="post.updated"></v-list-item-title>
						</v-list-item-content>
						<v-list-item-icon>
							<v-icon>mdi-trash</v-icon>
						</v-list-item-icon>
					</v-list-item>
				</v-list>
			</v-card>
		</v-menu>

		<v-btn tile elevation="1" color="teal darken-3" dark>
			{{ $t('posting.posting') }}
		</v-btn>
	</v-app-bar>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { TempPost, TempPostImage } from '@/interface/service';

@Component({
	components: {
	},
})
export default class Header extends Mixins(GlobalMixins) {

	public tempPosts: TempPost[] = [];
	public tempPostLoading: boolean = false;

	public mounted() {
		this.tempPosts = this.$local.read<TempPost[]>('temp_posting', JSON.parse) as TempPost[] || [];
		this.$logger.debug('post', 'Temp post list', this.tempPosts);
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

}
</script>
