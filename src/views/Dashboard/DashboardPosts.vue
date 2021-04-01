<!--
 * DashboardPosts.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<div>
		<h1>Hello World</h1>
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

		const content = await this.$git.getContent<MetaData[]>({
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
		console.log('content', content);
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
