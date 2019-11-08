<template>
	<v-container class="px-0">
		<v-row align="center" class="ma-0">
			<v-col class="pa-0">
				<v-card style="width:100%" flat>
					<v-list>
						<template v-for="(post) in postList">
							<v-list-item-group :key="post.href">
								<v-list-item :key="post.href">
									<v-list-item-avatar width="3rem" height="3rem">
										<v-img :src="post.cover" ></v-img>
									</v-list-item-avatar>
									<v-list-item-content>
										<v-list-item-title>
											<p class="headline">{{ post.title }}</p>
										</v-list-item-title>
									</v-list-item-content>
									<v-list-item-action>
										<v-tooltip top>
											<template v-slot:activator="{ on }">
												<v-btn icon v-on="on">
													<v-icon>mdi-pencil</v-icon> 
												</v-btn>
											</template>
											<span>{{ Lang('modify') }}</span>
										</v-tooltip>
									</v-list-item-action>
									<v-list-item-action>
										<v-tooltip top>
											<template v-slot:activator="{ on }">
												<v-btn icon v-on="on" @click="deletePost(post)">
													<v-icon>mdi-trash-can</v-icon> 
												</v-btn>
											</template>
											<span>{{ Lang('delete') }}</span>
										</v-tooltip>
									</v-list-item-action>
								</v-list-item>
							</v-list-item-group>
						</template>
					</v-list>
				</v-card>
			</v-col>
			<v-col cols="4" class="d-none d-md-flex"></v-col>
		</v-row>
		<Confirm/>
		<PLoading/>
		<Modal/>
	</v-container>
</template>
<script>
import axios from 'axios';
import { getGitJsonData, getSubposts, routeAssignUrl, findChildByTagName, removePost } from '../../modules/common.js';
import Confirm from '../Util/Confirm';
import PLoading from '../Util/PLoading';
import Modal from '../Util/Modal';
import Lang from '../../languages/Lang.js';

const loadPost = function(_this = this) {
	getGitJsonData(_this, axios, "posts.json").then(data => {
		let posts = data.json;
		posts.sha = data.sha;
		let postList = getSubposts(posts);
		// TODO: postList 시간 최신순 정렬

		_this.postList = postList;
		_this.posts = posts;
		_this.$forceUpdate();
	}).catch(() => {
	});
}

const deletePost = function(post) {
	let ploading = findChildByTagName(this, "PLoading");
	let modal = findChildByTagName(this, "Modal");
	let confirm = findChildByTagName(this, "Confirm");

	confirm.title = Lang('notification');
	confirm.content = Lang('myblog.list.delete_post');
	confirm.ok = Lang('ok');
	confirm.cancel = Lang('no');
	confirm.okClick = () => {
		confirm.hide();
		ploading.content = Lang('myblog.list.progress_delete');
		ploading.show();
		removePost(post, axios, this).then(() => {
			ploading.hide();
			modal.title = Lang('notification');
			modal.content = Lang('myblog.list.success_del_post');
			modal.ok = Lang('confirm');
			modal.okClick = () => {
				modal.hide();
				loadPost(this);
			};
			modal.show();
		}).catch(() => {
			ploading.hide();
			modal.title = Lang('error');
			modal.content = Lang('myblog.list.fail_del_post');
			modal.ok = Lang('confirm');
			modal.okClick = () => {
				modal.hide();
				routeAssignUrl('/');
			};
			modal.show();
		});
	};
	confirm.show();
};

export default {
	name: 'BlogList',
	components: {
		Confirm,
		PLoading,
		Modal
	},
	created: function() {
		// get posts.json
		loadPost(this);
	},
	methods: {
		Lang,
		deletePost
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
