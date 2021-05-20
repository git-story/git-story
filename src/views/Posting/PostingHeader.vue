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
	public selectedPostIdx: number = -1;

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
			console.log(JSON.stringify(this.tempPosts));
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

}
</script>