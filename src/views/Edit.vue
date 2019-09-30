<template>
	<v-content>
		<v-row class="div-height">
			<v-col>
					<v-row style="height:80px">
						<v-col cols="col-sm-1 col-lg-3"></v-col>
						<v-col>
							<v-text-field ref="input-title" label="제목을 입력하세요."></v-text-field>
						</v-col>
						<v-col cols="col-sm-1 col-lg-3"></v-col>
					</v-row>
					<v-row style="height:calc(100% - 80px)">
						<v-col cols="col-sm-1 col-lg-3"></v-col>
						<v-col height="100%" class="pt-0">
							<v-card height="100%">
								<Vueditor id="editorcontiner" ref="vueditor" v-model="text"></Vueditor>
							</v-card>
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
/* eslint-disable */
import axios from 'axios';
import { getGitJsonData, genNowDate, routeAssignUrl } from '../modules/common.js';

const searchPostsByCategory = function(posts, category="", level=0, deps=0) {
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
			if ( (deps+1) === (csplit.length-level) ) {
				// deps와 csplit의 길이가 같으면 해당 경로 반환
				return post;
			}

			// 아니면 하위 경로 탐색
			if ( post.single === false ) {
				return searchPostsByCategory(post.posts, category, level, deps+1);
			} else {
				// 싱글 카테고리라면 탐색 실패
				return;
			}
		}
	}
};

const buildContentHTML = function(_this = this) {
	return new Promise((resolve, reject) => {
		let contentHTML = _this.$refs.vueditor.getContent();
		getGitJsonData(_this, axios, "config.json").then(data => {
			let html = document.createElement('html');
			let cfg = data.json;

			const createChildElement = (e) => {
				let child = document.createElement(e.tag);
				let attrs = Object.keys(e.attr);
				attrs.forEach(a => {
					child.setAttribute(a, e.attr[a]);
				});
				return child;
			};

			let head = document.createElement('head');
			cfg.head.forEach(e => {
				let child = createChildElement(e);
				head.appendChild(child);
			});
			html.appendChild(head);

			let body = document.createElement('body');
			cfg.body.start.forEach(e => {
				let child = createChildElement(e);
				body.appendChild(child);
			});

			let bodyContent = document.createElement('main');
			bodyContent.innerHTML = contentHTML;
			body.appendChild(bodyContent);

			cfg.body.end.forEach(e => {
				let child = createChildElement(e);
				body.appendChild(child);
			});
			html.appendChild(body);
			resolve(html.outerHTML);
		}).catch(() => {
		});
	});
};

const doPostingContent = function() {
	// get posts.json
	getGitJsonData(this, axios, "posts.json").then(data => {
		let posts = data.json;
		let sha = data.sha;
		let userName = this.$store.getters.user.name;

		let selectedCategory = 'BLOG/#/Subcagegory';
		let apiUrl = this.$store.getters.config.api;
		let category = searchPostsByCategory(posts, selectedCategory);
		let path = category.href;
		let nowDate = genNowDate();
		let reqUrl = `${apiUrl}/repos/${userName}/${userName}.github.io/contents${path}${nowDate}/`;

		let title = this.$refs['input-title'].internalValue;


		// TODO: 글에서 대표 커버 찾아내는 알고리즘 추가
		let coverImg = null;
		if ( coverImg ) {
			
		} else {
			// 커버 이미지가 없으면 샘플에서 하나 선택
			let coverImgs = this.$store.getters.config['cover-samples'];
			let pickNum = Math.floor(Math.random() * coverImgs.length);
			coverImg = coverImgs[pickNum];
		}

		category.posts.push({
			cover: coverImg,
			href: `${path}${nowDate}/`,
			title: title,
		});

		let postsStr = JSON.stringify(posts, null, '\t');
		let b64posts = Buffer.from(postsStr, "utf8").toString('base64');

		// PUT /repos/:owner/:repo/contents/:path
		axios({
			url: `${apiUrl}/repos/${userName}/${userName}.github.io/contents/posts.json`,
			method: 'put',
			headers: {
				'Authorization': `Token ${this.$store.getters.token}`
			},
			data: {
				message: `${title} posting : posts.json`,
				content: b64posts,
				sha: sha
			}
		}).then(res => {
			buildContentHTML(this).then(contentHTML => {
				let b64Content = Buffer.from(contentHTML, "utf8").toString('base64');
				axios({
					url: `${reqUrl}index.html`,
					method: 'put',
					headers: {
						'Authorization': `Token ${this.$store.getters.token}`
					},
					data: {
						message: `${title} posting`,
						content: b64Content
					}
				}).then(res => {
					//
					routeAssignUrl('/my-blog', this);
				}).catch(err => {
					// TODO: 글 올리기 실패시 예외 처리
				});
			});
		}).catch(err => {
			// TODO: 글 올리기 실패시 예외 처리
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
	},
	data: () => ({
		text: "Test"
	}),
};
</script>
