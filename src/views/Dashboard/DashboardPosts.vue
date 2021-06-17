<!--
 * DashboardPosts.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-row class="ma-0" style="height: 100%;">
		<v-col cols="5" class="pa-0">
			<v-text-field
				class="pt-0 mx-3 mb-0"
				:loading="searchLoading"
				color="indigo"
				v-model="search"
				clearable
				:placeholder="$t('dashboard.blog.search-post')"
				append-icon="mdi-magnify"/>
			<div v-if="loading === false">
				<v-card
					:elevation="0" tile
					v-for="(empty, idx) in skeletonCount" :key="'skeleton-' + empty + idx"
					:class="idx > 0 ? 'mt-6' : ''">
					<div class="d-flex flex-no-wrap justify-space-between">
						<v-avatar
							class="ma-3"
							size="125"
							style="border-radius: 0.5rem;">
							<v-skeleton-loader min-height="250" max-height="250" max-width="250" min-width="250" type="image" />
						</v-avatar>

						<div style="width: 100%;">
							<v-skeleton-loader type="article" />
						</div>
					</div>
				</v-card>
			</div>
			<div v-else-if="posts.length > 0">
				<post-item
					v-for="(post, idx) in posts"
					:key="post.href"
					:post="post"
					:config="config"
	 				:meta-data="metaData"
					@remove="remove(post)"/>
				<infinite-loading @infinite="nextPostLoading">
					<template v-slot:no-results>
						<span></span>
					</template>
					<template v-slot:no-more>
						<span></span>
					</template>
				</infinite-loading>
			</div>
			<v-row
	   			v-else
				align="center"
				style="height: 100%;"
				class="ma-0">
				<v-col cols="12" align="center">
					<v-img
		 				max-width="200px"
	   					max-height="200px"
					 	:src="imgs.empty"></v-img>
					<v-divider class="my-4" style="width: 200px;"></v-divider>
					<p>{{ $t('dashboard.blog.empty') }}</p>
				</v-col>
			</v-row>
		</v-col>
		<v-col cols="7" class="pa-0">
			<v-row class="ma-0" height="100%;" style="position: fixed; width: 42%; height: 86%;" align="center">
				<v-col cols="12" class="py-0" align="center">
					<h1 class="display-4">. . .</h1>
					<p class="mt-4">{{ $t('dashboard.blog.soon') }}</p>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Repository } from '@/interface/github';
import { MetaData } from '@/interface/service';
import PostItem from 'views/Dashboard/DashboardPostItem.vue';
import firebase from 'firebase';
import yaml from 'js-yaml';
import InfiniteLoading from 'vue-infinite-loading';
import { Imgs } from 'types/index';

@Component({
	components: {
		PostItem,
		InfiniteLoading,
	},
})
export default class DashboardPosts extends Mixins(GlobalMixins) {

	public postList: MetaData[] = [];
	public metaData: MetaData[] = [];
	public metaIdx: number = 0;
	public loadNumPerOneTime: number = 5;
	public skeletonCount: any[] = Array(this.loadNumPerOneTime);
	public config: any = {};

	public search: string = '';
	public searchLoading: boolean = false;
	public loading: boolean = false;

	private imgs: Imgs = {
		empty: require('assets/dashboard/empty.png'),
	};

	get posts() {
		if ( this.search ) {
			this.searchLoading = true;
			const result = this.metaData.filter((post: MetaData) => post.title.match(this.search));
			this.searchLoading = false;
			return result;
		}
		return this.postList;
	}

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
		this.config = await this.$git.getContent<any>('_config.yml', 'yaml');
		this.metaData = content as MetaData[];
		this.nextPostLoading();
		this.loading = true;
	}

	public async initialize(repo: string): Promise<MetaData[]> {
		await this.createBlogRepo(repo);
		let content: any;
		do {
			try {
				const { data } = await this.$axios.get(`https://raw.githubusercontent.com/${this.$store.getters.user.userName}/${repo}/master/meta-data.json`);
				content = data as MetaData[];
			} catch {
				await this.$sleep(3000);
			}
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

		await this.$sleep(1000);
		await this.$git.workflowClear();

		let loop: boolean = true;
		while ( loop ) {
			try {
				this.$git.add('_config.yml', yaml.dump(config));
				await this.$git.commit('Setting _config.yml');
				loop = false;
			} catch {
				await this.$sleep(5000);
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

	public async nextPostLoading($state?: any) {
		for ( let i = 0; i < this.loadNumPerOneTime; i++ ) {
			if ( this.metaIdx < this.metaData.length ) {
				this.postList.push(this.metaData[this.metaIdx++]);
			}
		}
		if ( $state ) {
			if ( this.metaIdx < this.metaData.length ) {
				$state.loaded();
			} else {
				$state.complete();
			}
		}
	}

	public remove(post: MetaData) {
		const pidx = this.postList.findIndex((p: MetaData) => post.title === p.title);
		if ( pidx > -1 ) {
			this.postList.splice(pidx, 1);
		}

		const midx = this.metaData.findIndex((m: MetaData) => post.title === m.title);
		if ( midx > -1 ) {
			this.metaData.splice(midx, 1);
		}
	}

}
</script>
