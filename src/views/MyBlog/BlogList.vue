<template>
	<v-container class="px-0">
		<v-row align="center" class="ma-0">
			<v-col class="pa-0">
				<v-row>
					<v-col class="">
						<h3 class="display-1 white--text">
							{{ $t('myblog.table.content-list') }}
						</h3>
					</v-col>
					<v-col>
						<v-text-field
							dark
							v-model="dt.search"
							append-icon="mdi-magnify"
							:label="$t('myblog.table.search')"
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
							<span>{{ $t('modify') }}</span>
						</v-tooltip>
						<v-tooltip right>
							<template v-slot:activator="{ on }">
								<v-btn class="" text icon v-on="on" @click="deletePost(item)">
									<v-icon dark>mdi-trash-can</v-icon>
								</v-btn>
							</template>
							<span>{{ $t('delete') }}</span>
						</v-tooltip>
					</template>
				</v-data-table>
			</v-col>
			<v-col cols="2" class="d-none d-md-flex"></v-col>
		</v-row>
		<PLoading ref="PLoading"/>
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
import { getSubposts, findChildByTagName, removePost } from '../../modules/common.js';
import PLoading from '../Util/PLoading';

export default {
	name: 'BlogList',
	components: {
		PLoading,
	},
	created: function() {
		// get posts.json
		this.loadPosting();

		this.$evt.$on('myblog.list.reload', () => {
			this.loadPosting();
		});
	},
	methods: {
        createTableItems(posts) {
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
                let childs = this.createTableItems(subs);

                obj = obj.concat(childs);
            });

            return obj;
        },
        modifyPost(post) {

            let editInfoObj = {"title": post.title, "href": post.href}
            let editInfoJsonString = JSON.stringify(editInfoObj)

            let editInfoJsonStringb64 = Buffer.from(editInfoJsonString, 'utf8').toString('base64');
            this.$router.push("/edit/" + editInfoJsonStringb64) 

        },
        deletePost(item) {
            let task = this.$store.getters.task;

            this.targetPost = null;
            if ( task === true ) {
                this.$modal({
                    title: this.$t('notification'),
                    content: this.$t('inprogress'),
                    textOk: this.$t('confirm'),
                });
                return;
            }

            this.targetPost = item;
            this.$confirm({
                title: this.$t('notification'),
                content: this.$t('myblog.list.delete_post'),
                textOk: this.$t('ok'),
                textCancel: this.$t('no'),
                ok: this.realDeletePost,
            });
        },
        realDeletePost() {
            let ploading = findChildByTagName(this, "PLoading");
            const post = this.targetPost;
            if ( !post ) {
                return;
            }

            this.$store.commit('task', true);

            ploading.content = this.$t('myblog.list.progress_delete');
            ploading.show();

            removePost(post, this).then((removed) => {
                ploading.hide();
                this.$modal({
                    title: this.$t('notification'),
                    content: this.$t('myblog.list.success_del_post'),
                    textOk: this.$t('confirm'),
                    ok: () => {
                        let desserts = this.createTableItems(removed);
                        this.dt.desserts = desserts;
                        this.$forceUpdate();
                    },
                });
            }).catch(() => {
                ploading.hide();
                this.$modal({
                    title: this.$t('error'),
                    content: this.$t('myblog.list.fail_del_post'),
                    textOk: this.$t('confirm'),
                    ok: () => {
                        this.$assign('/');
                    },
                });
            }).finally(() => {
                this.$store.commit('task', false);
            });
        },
        async loadPosting () {
            let gitApi = this.$store.getters.api;

            let retryCnt = -1;
            const MAX_RETRY_CNT = 5;
            let data;
            do {
                try {
                    data = await gitApi.repo.getJsonData("posts.json");
                } catch (err) {
                    retryCnt++;
                }
            } while ( !data && retryCnt < MAX_RETRY_CNT );

            if ( retryCnt >= MAX_RETRY_CNT ) {
                // 최대 재시도 횟수 초과시
                this.$evt.$emit('myblog.call-mounted');
            } else {
                let posts = data.json;
                let postList = getSubposts(posts);
                // TODO: postList 시간 최신순 정렬

                let rtn = this.createTableItems(posts);
                this.dt.desserts = rtn;

                this.postList = postList;
                this.posts = posts;
                this.posts_ori = data;
                this.$evt.$emit('page-loading-end');
            }
        },
	},
	mounted: function() {
	},
	data: function() {
		return {
			postList: [],
			dt: {
				search: '',
				headers: [
					{ text: this.$t('myblog.table.title'), value: 'title', align: 'left' },
					{ text: this.$t('myblog.table.date'), value: 'date', align: 'center' },
					{ text: this.$t('myblog.table.category'), value: 'category', align: 'center' },
					{ text: this.$t('action'), value: 'action', sortable: false, align: 'center' }
				],
				desserts: [
				]
			},
            targetPost: null,
		}
	},
};
</script>
