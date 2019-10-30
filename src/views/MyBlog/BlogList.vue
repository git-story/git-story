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
		<Confirm/>
		<PLoading/>
	</v-container>
</template>
<script>
import axios from 'axios';
import { getGitJsonData, getSubposts, routeAssignUrl, findChildByTagName, removeRepository } from '../../modules/common.js';
import Confirm from '../Util/Confirm';
import PLoading from '../Util/PLoading';
import Lang from '../../languages/Lang.js';

export default {
	name: 'BlogList',
	components: {
		Confirm,
		PLoading
	},
	created: function() {
		// get posts.json
		getGitJsonData(this, axios, "posts.json").then(data => {
			let posts = data.json;
			let postList = getSubposts(posts);
			// TODO: postList 시간 최신순 정렬

			this.postList = postList;
			this.$forceUpdate();
		}).catch(() => {
			let confirm = findChildByTagName(this, "Confirm");
			let ploading = findChildByTagName(this, "PLoading");

			confirm.title = Lang('notification');
			confirm.content = Lang('have_repo_but');
			confirm.ok = Lang('ok');
			confirm.cancel = Lang('no');
			confirm.okClick = () => {
				let full_name = `${this.$store.getters.user.name}/${this.$store.getters.user.name}.github.io`;
				// 레포지토리 생성
				ploading.show();
				confirm.hide();

				removeRepository(full_name, this.$store, axios).finally(() => {
					ploading.hide();
					this.$forceUpdate();
				});
			};
			confirm.cancelClick = () => {
				routeAssignUrl('/', this);
				confirm.hide();
			};
			confirm.show();
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
