<!--
 * DashboardPosts.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<div class="mx-6">
		<v-card tile elevation="1"
				v-for="(post, idx) in postList" :key="post.href">
			<v-img
				height="250"
				src="https://cdn.pixabay.com/photo/2017/06/28/10/53/board-2450236_960_720.jpg"></v-img>

			<v-card-title>{{ post.title }}</v-card-title>
			<v-card-text>
				<v-row align="center" class="mx-0">
					<div></div>
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
	</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Repository } from '@/interface/github';
import { MetaData } from '@/interface/service';
import firebase from 'firebase';

@Component({
	components: {
	},
})
export default class DashboardPosts extends Mixins(GlobalMixins) {

	public postList: MetaData[] = [];

	public async mounted() {
		this.$logger.debug('app', 'DashboardPosts mounted');
		const repoName = `${this.$store.getters.user.userName}.github.io`;
		const repo = await this.getBlogRepo(repoName);
		if ( !repo ) {
			await this.$modal({
				title: this.$t('dashboard.blog.not-found-repo.title'),
				content: this.$t('dashboard.blog.not-found-repo.content', repoName),
			}).then(async (close) => {
				await this.createBlogRepo(repoName);
				close();
			});
		}

		let content = await this.$git.getContent<MetaData[]>({
			owner: this.$store.getters.user.userName,
			repo: repoName,
			path: 'meta-data.json',
		}, 'json');

		if ( !content ) {
			await this.$confirm({
				title: this.$t('notice'),
				content: this.$t('dashboard.blog.not-found-meta-data'),
				type: 'warning',
				textOk: this.$t('create-new'),
				textCancel: this.$t('logout'),
			}).then(async (close) => {
				await this.$git.rest.repos.delete({
					owner: this.$store.getters.user.userName,
					repo: repoName,
				});

				await this.createBlogRepo(repoName);

				content = await this.$git.getContent<MetaData[]>({
					owner: this.$store.getters.user.userName,
					repo: repoName,
					path: 'meta-data.json',
				}, 'json');

				close();
			}).catch(async (close) => {
				// TODO: 어떻게 깃헙까지 로그아웃합니까?
				if ( firebase.auth().currentUser ) {
					await firebase.auth().signOut();
				}
				this.$session.write('userInfo', '');
				this.$assign('/');

				close();
			});
		}

		this.postList = content as MetaData[];
		console.log(this.postList);
	}

	public async getBlogRepo(name: string): Promise<Repository|void> {
		try {
			const { data } = await this.$git.getRepo(name);
			return data as Repository;
		} catch (err) {
			this.$logger.error('github', err);
		}
	}

	public async createBlogRepo(name: string): Promise<void> {
		await this.$git.rest.repos.createUsingTemplate({
			template_owner: this.$store.getters.service.name,
			template_repo: this.$store.getters.service.template,
			name,
			owner: this.$store.getters.user.userName,
			private: false,
			description: this.$t('github.description'),
		});
	}

}
</script>
