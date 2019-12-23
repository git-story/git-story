<template>
	<v-container class="px-0">
		<v-row align="center" class="ma-0">
			<v-col class="pa-0">
				<v-row>
					<v-col class="">
						<h3 class="display-1 white--text">
							{{ Lang('myblog.table.content-list') }}
						</h3>
					</v-col>
					<v-col>
						<v-text-field
							dark
							v-model="dt.search"
							append-icon="mdi-magnify"
							:label="Lang('myblog.table.search')"
							single-line
							hide-details
							></v-text-field>
					</v-col>
				</v-row>
				<v-data-table
					:headers="dt.headers"
					:items="dt.desserts"
					:search="dt.search"
					class="elevation-0 mt-5 custom"
					sort-desc
					sort-by="date"
					style="background: transparent"
					dark
					>
					<template v-slot:item.action="{ item }">
						<v-tooltip left>
							<template v-slot:activator="{ on }">
								<v-btn class="" text icon v-on="on" @click="modifyPost(item)">
									<v-icon dark>mdi-pencil</v-icon>
								</v-btn>
							</template>
							<span>{{ Lang('modify') }}</span>
						</v-tooltip>
						<v-tooltip right>
							<template v-slot:activator="{ on }">
								<v-btn class="" text icon v-on="on" @click="deletePost(item)">
									<v-icon dark>mdi-trash-can</v-icon>
								</v-btn>
							</template>
							<span>{{ Lang('delete') }}</span>
						</v-tooltip>
					</template>
				</v-data-table>
			</v-col>
			<v-col cols="2" class="d-none d-md-flex"></v-col>
		</v-row>
		<Confirm/>
		<PLoading/>
		<Modal/>
	</v-container>
</template>
<style>
div.custom.v-data-table table thead tr th {
	font-size: 12pt !important;
}
div.custom.v-data-table table tbody tr td {
	font-size: 11pt !important;
}
div.custom.v-data-table table tbody tr:hover {
	background: rgba(100, 100, 100, 0.3) !important;
}
</style>
<script>
import { getSubposts, routeAssignUrl, findChildByTagName, removePost } from '../../modules/common.js';
import Confirm from '../Util/Confirm';
import PLoading from '../Util/PLoading';
import Modal from '../Util/Modal';
import Lang from '../../languages/Lang.js';

const createTableItems = function(posts) {
	let keys = Object.keys(posts);
	let obj = [];

	keys.forEach((category) => {
		let cat = posts[category];
		let postList = cat.posts;


		postList.forEach((p) => {
			let postDate = p.href.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}/g).join('');
			let po  = { // push object target
				"title": p.title,
				"category": category,
				"date": postDate,
				"href": p.href
			};
			obj.push(po);
		});

		let subs = cat.sub;
		let childs = createTableItems(subs);

		obj = obj.concat(childs);
	});

	return obj;
};

const modifyPost = function(post) {

	let editInfoObj = {"title": post.title, "href": post.href}
	let editInfoJsonString = JSON.stringify(editInfoObj)

	let editInfoJsonStringb64 = Buffer.from(editInfoJsonString, 'utf8').toString('base64');
	this.$router.push("/edit/" + editInfoJsonStringb64) 

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
		removePost(post, this).then((removed) => {
			ploading.hide();
			modal.title = Lang('notification');
			modal.content = Lang('myblog.list.success_del_post');
			modal.ok = Lang('confirm');
			modal.okClick = () => {
				let desserts = createTableItems(removed);
				this.dt.desserts = desserts;
				this.$forceUpdate();
				modal.hide();
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
		let gitApi = this.$store.getters.api;
		gitApi.repo.getJsonData("posts.json").then(data => {
			let posts = data.json;
			let postList = getSubposts(posts);
			// TODO: postList 시간 최신순 정렬

			let rtn = createTableItems(posts);
			this.dt.desserts = rtn;

			this.postList = postList;
			this.posts = posts;
			this.posts_ori = data;
		}).catch(() => {
		});
	},
	methods: {
		Lang,
		deletePost,
		modifyPost
	},
	mounted: function() {
	},
	data: function() {
		return {
			postList: [],
			dt: {
				search: '',
				headers: [
					{ text: Lang('myblog.table.title'), value: 'title', align: 'left' },
					{ text: Lang('myblog.table.date'), value: 'date', align: 'center' },
					{ text: Lang('myblog.table.category'), value: 'category', align: 'center' },
					{ text: Lang('action'), value: 'action', sortable: false, align: 'center' }
				],
				desserts: [
				]
			}
		}
	},
};
</script>
