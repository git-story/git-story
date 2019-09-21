<template>
	<v-content>
		<v-row class="div-height">
			<v-col>
				<v-row style="height:10%">
					<v-col cols="col-sm-1 col-lg-3"></v-col>
					<v-col>
						<v-text-field label="제목을 입력하세요."></v-text-field>
					</v-col>
					<v-col cols="col-sm-1 col-lg-3"></v-col>
				</v-row>
				<v-row style="height:90%">
					<v-col cols="col-sm-1 col-lg-3"></v-col>
					<v-col height="100%" class="pt-0">
						<Vueditor id="editorcontiner" ref="vueditor" v-model="text"></Vueditor>
					</v-col>
					<v-col cols="col-sm-1 col-lg-3"></v-col>
				</v-row>
			</v-col>
		</v-row>

		<!-- S:Footer -->
		<v-footer height="80" fixed class="font-width-medium pl-12 pr-12">
			<v-row align="center">
				<v-col></v-col>
				<v-col align="end">
					<v-btn @click="doPosting" large color="teal darken-4" style="color:white;">
						포스팅
					</v-btn>
				</v-col>
			</v-row>
		</v-footer>
		<!-- E:Footer -->
	</v-content>
</template>


<style scoped>
.vueditor {
	height: 100%;
}
.div-height {
	height:calc( 100% - 64px );
	padding-bottom: 15px;
}
</style>

<script>
import axios from 'axios';
import { getPostsData, genNowDate } from '../modules/common.js';

const getPathByCategory = function(posts, category="", deps=0) {
	let c = Object.keys(posts);
	let clen = c.length;
	let csplit = category.split(/\/#\//g);

	// /#/ 기준으로 레벨을 나눈다.
	// csplit[deps] 가 현재 카테고리를 뜻한다.
	// posts 는 현재 deps 의 posts 를 가져온다.
	if ( csplit.length === 0 ) {
		return;
	}

	for (let i=0;i<clen;i++) {
		let cname = c[i];
		if ( cname === csplit[deps] ) {
			let post = posts[cname];
			if ( deps+1 === csplit.length ) {
				// deps와 csplit의 길이가 같으면 해당 경로 반환
				return post.href;
			}

			// 아니면 하위 경로 탐색
			if ( post.single === false ) {
				return getPathByCategory(post.posts, category, deps+1);
			} else {
				// 싱글 카테고리라면 탐색 실패
				return;
			}
		}
	};
};

const doPostingContent = function() {
	// get posts.json
	getPostsData(this, axios).then(posts => {
		let userName = this.$store.getters.user.name;
		let userEmail = this.$store.getters.user.email;

		let selectedCategory = 'BLOG/#/Subcagegory';
		let apiUrl = this.$store.getters.config.api;
		let path = getPathByCategory(posts, selectedCategory);
		let nowDate = genNowDate();
		let reqUrl = `${apiUrl}/repos/${userName}/${userName}.github.io/contents${path}/${nowDate}/index.html`;

		let title = 'Hello World!';
		let contentHTML = this.$refs.vueditor.getContent();
		let b64Content = Buffer.from(contentHTML, "utf8").toString('base64');


		// PUT /repos/:owner/:repo/contents/:path
		axios({
			url: reqUrl,
			method: 'put',
			headers: {
				'Authorization': `Token ${this.$store.getters.token}`
			},
			data: {
				message: `${title} posting`,
				content: b64Content
			}
		}).then(res => {
			console.log(res);
		});
	});
};


export default {
	name: 'Edit',
	methods: {
		doPosting: doPostingContent,
		getContent : function() {
			this.text = this.$refs.vueditor.getContent()
		}
	},
	mounted: function() {
		console.log(Date.format);

	},
	data: () => ({
		text: "Test"
	}),
};
</script>
