<template>
	<v-container>
		<v-row>
			<v-col cols="4"></v-col>
			<v-col>
				<v-list three-line>
					<template v-for="(post) in postList">
						<v-list-item :key="post.href">
							<v-list-item-avatar width="5rem" height="5rem">
								<v-img :src="post.cover" ></v-img>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title>
									<h1>{{ post.title }}</h1>
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</template>
				</v-list>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import axios from 'axios';
import { getGitJsonData, getSubposts } from '../../modules/common.js';

export default {
	name: 'BlogList',
	components: {
	},
	created: function() {
		// get posts.json
		getGitJsonData(this, axios, "posts.json").then(data => {
			let posts = data.json;
			let postList = getSubposts(posts);
			// TODO: postList 시간 최신순 정렬

			this.postList = postList;
			this.$forceUpdate();
		});
	},
	methods: {
	},
	mounted: function() {
	},
	data: function() {
		return {
			postList: []
		}
	},
};
</script>
