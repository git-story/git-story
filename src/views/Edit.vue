<template>
	<v-content>
		<v-row class="div-height">
			<v-col>
				<v-row style="height:80px">
					<v-col sm="1" md="3"></v-col>
					<v-col>
						<v-text-field ref="input-title" color="secondery" :label="Lang('editor.input-title')"></v-text-field>
						<Vueditor id="editorcontiner" ref="vueditor" v-model="text"></Vueditor>
					</v-col>
					<v-col sm="1" md="3"></v-col>
				</v-row>
				<v-row class="mt-10" style="height:calc(100% - 80px)">
					<v-col height="100%" class="pt-0">
					</v-col>
				</v-row>
			</v-col>
		</v-row>

		<!-- S:Footer -->
		<v-footer height="80" color="grey lighten-4" fixed class="font-width-medium pl-12 pr-12">
			<v-row align="center">
				<v-col></v-col>
				<v-col align="end">
					<v-btn @click="doPosting" elevation="5" tile large color="grey darken-3" style="color:white;">
						{{ Lang('editor.post') }}
					</v-btn>
				</v-col>
			</v-row>
		</v-footer>
		<!-- E:Footer -->

		<PLoading/>
	</v-content>
</template>

<style>
body {
	min-width: 800px;
	background-color: white;
}
div.v-application {
	background-color: white !important;
}


.vueditor > .ve-toolbar {
	width: 100%;
	left: 0;
	position: fixed;
	top: 64px;
	z-index: 7; /* back to icon menu, front to content input */
	box-shadow: 0px 0px 5px #cacaca;
}

.v-text-field .v-label--active {
	transform: translateY(-20px) scale(0.5);
}
.v-text-field input {
	font-size: 2rem;
	max-height: 100px;
	line-height: 40px;
	margin-top: 10px;
}
.v-text-field label {
	height:70px !important;
	line-height: 50px !important;
	font-size: 2rem;
}
</style>

<style scoped>
.vueditor {
	background-color: transparent;
	border: 0;
	width:100%;
	height: 750px;
}
.div-height {
	height:calc( 100% - 64px );
	padding-bottom: 15px;
	margin-bottom: 400px;
	padding-top: 100px;
}
</style>

<script>
/* eslint-disable */
import axios from 'axios';
import { getGitJsonData, genNowDate, findChildByTagName, routeAssignUrl } from '../modules/common.js';
import PLoading from './Util/PLoading';
import Lang from '../languages/Lang.js';

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

		let ploading = findChildByTagName(this, "PLoading");
		ploading.show();
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
					ploading.hide();
					routeAssignUrl('/my-blog', this);
				}).catch(err => {
					// TODO: 글 올리기 실패시 예외 처리
				});
			});
		}).catch(err => {
			// TODO: 글 올리기 실패시 예외 처리
		});
	}).catch((err) => {});
};

export default {
	name: 'Edit',
	components: {
		PLoading
	},
	methods: {
		doPosting: doPostingContent,
		getContent : function() {
			this.text = this.$refs.vueditor.getContent()
		},
		Lang
	},
	mounted: function() {
		// 임시적으로 에디터 툴바 메뉴의 위치를 옮김

		let selectMenus = document.querySelectorAll('div.vueditor div.ve-toolbar div.ve-select');
		const S_CODE_HLT = 0;
		const S_TAG = 1;
		const S_FONT = 2;
		const S_FONT_SIZE = 3;
		// code highlight
		let code_hlt = document.querySelector('div.vueditor div.ve-dropdown._10cV1loMgUSCh2Gf6O8hsF_0');
		let code_hlt_sel = selectMenus[S_CODE_HLT];
		if ( code_hlt && code_hlt_sel ) {
			code_hlt_sel.addEventListener('click', (e) => {
				let rect = code_hlt_sel.getBoundingClientRect();
				code_hlt.style.position = "fixed";
				code_hlt.style.top = (rect.y + rect.height) + "px";
				code_hlt.style.left = rect.x + "px";
			});
		}

		// tag
		let tag = document.querySelector('div.vueditor div.ve-dropdown._2ddaIaDnYon4oaNo9HwhTU_0');
		let tag_sel = selectMenus[S_TAG];
		if ( tag && tag_sel ) {
			tag_sel.addEventListener('click', (e) => {
				let rect = tag_sel.getBoundingClientRect();
				tag.style.position = "fixed";
				tag.style.top = (rect.y + rect.height) + "px";
				tag.style.left = rect.x + "px";
			});
		}

		// font
		let font = document.querySelector('div.vueditor div.ve-dropdown.XlQ1oyUFxq9sfpmr-kqea_0');
		let font_sel = selectMenus[S_FONT];
		if ( font && font_sel ) {
			font_sel.addEventListener('click', (e) => {
				let rect = font_sel.getBoundingClientRect();
				font.style.position = "fixed";
				font.style.top = (rect.y + rect.height) + "px";
				font.style.left = rect.x + "px";
			});
		}

		let font_size = document.querySelector('div.vueditor div.ve-dropdown._2gMMU7OLy1ok1hmmAGzabR_0');
		let font_size_sel = selectMenus[S_FONT_SIZE];
		if ( font_size && font_size_sel ) {
			font_size_sel.addEventListener('click', (e) => {
				let rect = font_size_sel.getBoundingClientRect();
				font_size.style.position = "fixed";
				font_size.style.top = (rect.y + rect.height) + "px";
				font_size.style.left = rect.x + "px";
			});
		}
		console.log(this);
	},
	data: () => ({
		text: "Test"
	}),
};
</script>
