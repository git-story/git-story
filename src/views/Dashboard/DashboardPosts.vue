<!--
 * DashboardPosts.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<div class="mx-6">
		<div v-if="postList.length === 0">
			<v-card
				elevation="1" tile
				v-for="(empty, idx) in skeletonCount" :key="'skeleton-' + empty + idx"
				:class="idx > 0 ? 'mt-6' : ''">
				<v-skeleton-loader type="image, article, divider, actions" />
			</v-card>
		</div>
		<div v-else>
			<post-item
				v-for="(post, idx) in postList"
				:key="post.href"
				:post="post"
				:class="idx > 0 ? 'mt-6' : ''"/>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Repository } from '@/interface/github';
import { MetaData } from '@/interface/service';
import PostItem from 'views/Dashboard/DashboardPostItem.vue';
import firebase from 'firebase';
import yaml from 'js-yaml';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Component({
	components: {
		PostItem,
	},
})
export default class DashboardPosts extends Mixins(GlobalMixins) {

	public postList: MetaData[] = [];
	public skeletonCount: any[] = Array(5);

	public async mounted() {
		this.$logger.debug('app', 'DashboardPosts mounted');
		const repoName = `${this.$store.getters.user.userName}.github.io`;
		const repo = await this.getBlogRepo(repoName);
		let content: any = {};
		if ( !repo ) {
			await this.$modal({
				title: this.$t('dashboard.blog.not-found-repo.title'),
				content: this.$t('dashboard.blog.not-found-repo.content', repoName),
			}).then(async (close) => {
				content = await this.initialize(repoName);
				close();
			});
		} else {
			content = await this.$git.getContent<MetaData[]>('meta-data.json', 'json');
		}


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

				content = await this.initialize(repoName);
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

		await this.$git.initRepo(repoName);
		this.postList = content as MetaData[];
	}

	public async initialize(repo: string): Promise<MetaData[]> {
		await this.createBlogRepo(repo);
		let content: any;
		do {
			await sleep(1000);
			content = await this.$git.getContent<MetaData[]>('meta-data.json', 'json', repo);
		} while ( !content );

		await this.$git.initRepo(repo);

		const config = await this.$git.getContent<any>('_config.yml', 'yaml');
		config.root = '/';
		config.url = `https://${this.$store.getters.user.userName}.github.io/`;
		config.title = config.author = this.$store.getters.user.userName;

		await this.$git.rest.repos.updateInformationAboutPagesSite({
			owner: this.$store.getters.user.userName,
			repo,
			source: {
				branch: 'master',
				path: '/' + config.public_dir,
			},
		});

		await sleep(1000);
		await this.$git.workflowClear();

		let loop: boolean = true;
		while ( loop ) {
			try {
				this.$git.add('_config.yml', yaml.dump(config));
				await this.$git.commit('Setting _config.yml');
				loop = false;
			} catch {
				await sleep(5000);
			}
			await this.$git.clear();
		}

		return content as MetaData[];
	}

	public async getBlogRepo(name: string): Promise<Repository|void> {
		try {
			return await this.$git.initRepo(name);
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
