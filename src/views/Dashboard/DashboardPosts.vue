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
			}).then(async () => {
				await this.$git.rest.repos.createUsingTemplate({
					template_owner: this.$store.getters.service.name,
					template_repo: this.$store.getters.service.template,
					name: repoName,
					owner: this.$store.getters.user.userName,
					private: false,
					description: '📚 [GITSTORY] 🚥 Writing post easier and faster',
				});
			});
		}

		console.log('repo', repo);
	}

	public async getBlogRepo(name: string): Promise<Repository|void> {
		try {
			const { data } = await this.$git.getRepo(name);
			return data as Repository;
		} catch (err) {
			this.$logger.error('github', err);
		}
	}

}
</script>
