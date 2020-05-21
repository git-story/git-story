<template>
	<v-content>
		<!-- S:Vueditor -->
		<v-row style="height:calc( 100% - 64px );">
			<v-col>
				<v-row style="height:calc( 100% - 80px ); margin-bottom: 120px">
					<v-col sm="1" md="3"></v-col>
					<v-col>
						<v-text-field tabindex="1" ref="input-title" color="secondery" class="custom-title" :label="$t('editor.input-title')" v-model="title"></v-text-field>
						<!-- <Vueditor id="editorcontiner" ref="vueditor" class="custom" v-model="text"></Vueditor> -->
						<!-- <Editor id="tuiEditor" ref="tuieditor" :options="tuiOptions" tabindex="2" mode="wysiwyg" height="100%" v-model="text"></Editor> -->
						<TuiEditor ref="tui-editor" />
					</v-col>
					<v-col sm="1" md="3"></v-col>
				</v-row>
			</v-col>
		</v-row>
		<!-- E:Vueditor -->
		
		<!-- S:Footer -->
		<v-footer height="80" color="grey lighten-4" fixed class="font-width-medium pl-12 pr-12">
			<v-row align="center">
				<v-col></v-col>
				<v-col align="end">
					<!-- S:Posting -->
					<v-menu
						v-model="menu"
						max-width="500px"
						min-width="500px"
						:close-on-content-click="false"
						transition="slide-y-transition"
						top
						left
						:offset-y="true">
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" elevation="5" tile large color="grey darken-3" style="color:white;">
								{{ $t('editor.post') }}
							</v-btn>
						</template>
		
						<!-- S:Posting Menu -->
						<v-card class="">
							<v-card-text>
								<v-container>
									<v-row align="center">
										<v-col cols="4">
											<v-subheader>{{ $t('editor.category') }}</v-subheader>
										</v-col>
										<v-col>
											<v-select
												v-model="c_sel"
												:items="categoryItem"
												item-text="name"
												item-value="value"
												:label="$t('editor.select')"
												return-object
												single-line></v-select>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>
		
							<v-card-actions>
								<v-spacer></v-spacer>
		
								<v-btn text @click="menu = false">{{ $t('cancel') }}</v-btn>
								<v-btn color="success" text @click="menu = false; doPosting()">{{ $t('ok') }}</v-btn>
							</v-card-actions>
						</v-card>
						<!-- E:Posting Menu -->
					</v-menu>
					<!-- E:Posting -->
				</v-col>
			</v-row>
		</v-footer>
		<!-- E:Footer -->
		
	</v-content>
</template>
<script>
import axios from 'axios';
import { genNowDate, getObject, removePost } from '../modules/common.js';
import beautify from 'js-beautify'
import TuiEditor from './TuiEditor';


const doPostingContent = function() {
	let task = this.$store.getters.task;
	if ( task === true ) {
        this.$modal.show({
            title: this.$t('notification'),
            content: this.$t('inprogress'),
            ok: this.$t('confirm'),
        });
		return;
	}
	

	// get posts.json
	if ( this.posts ) {
		this.$store.commit('task', true);
		let posts = this.posts;

		let selectedCategory = this.c_sel.value;
		let category = getObject(posts, selectedCategory);

		// 실제 파일은 카테고리와 무관하게
		// 디렉토리를 더 나누지 않고 /posts 아래 바로 위치하도록 수정
		// 2020-01-22
		// 변수 path 는 href 로 바꿈.
		// path 는 실제 카테고리의 경로를 가지고 있음.
		
		let path = category.href;
		let href = "/posts/";
		let nowDate = genNowDate();
		
		let requestBase = `${href}${nowDate}/`
		
		if (this.indexPath.length > 0) { // 편집하는 경우 기존 경로로
			requestBase = this.indexPath;
		}
		
		let coverImg = null;
		if ( coverImg ) {
			// TODO: 글에서 대표 커버 찾아내는 알고리즘 추가
		} else {
			// 커버 이미지가 없으면 샘플에서 하나 선택
			let coverImgs = this.$store.getters.config['cover-samples'];
			let pickNum = Math.floor(Math.random() * coverImgs.length);
			coverImg = coverImgs[pickNum];
		}
		
		if (this.indexPath.length > 0) {
			// 기존 정보 post.json에서 제거
			removePost({"title": this.title, "href": requestBase}, axios, this, false);
		}
		category.posts.push({
			cover: coverImg,
			href: requestBase,
			title: this.title,
			path: path,
		});

		let commitMsg = `📚 [GITSTORY] 📝 POSTING : [${this.title.toUpperCase()}]`;

        this.$loader.text = this.$t('editor.uploading');
        this.$loader.start();

		// posting
		let gitApi = this.$store.getters.api;
		let val = this.$refs['tui-editor'].getValues();

		let contentHTML = this.buildContentHTML(val.html);
		let reqHtmlUrl = requestBase + 'index.html';
		let reqMdUrl = requestBase + 'index.md';
		gitApi.repo.commitFiles(commitMsg, [
			{
				"path": "posts.json",
				"content": posts
			}, 
			{
				"path": reqHtmlUrl,
				"content": contentHTML,
			},
			{
				"path": reqMdUrl,
				"content": val.md,
			},
		]).then(() => {
            this.$loader.stop();
			this.$assign('/my-blog');
		}).finally(() => {
			this.$store.commit('task', false);
		});
	}
};

const createCategoryItems = function(posts, id="", level=0) {
	let keys = Object.keys(posts);
	let obj = [];

	keys.forEach((k) => {
		let cat = posts[k];
		let po  = { // push object target
			value: id+k,
			name: ` ${">".repeat(level)} ${k}`
		};

		obj.push(po);
		let subs = cat.sub;
		let skeys = Object.keys(subs);
		if ( skeys.length > 0 ) {
			let next_id = `${id}${k}.sub.`;
			let child = createCategoryItems(subs, next_id, level+1);
			obj = obj.concat(child);
		}

	});

	return obj;
};

export default {
	name: 'Edit',
	components: {
		TuiEditor,
		// Editor,
	},
	props: ['editinfo'],
	methods: {
		doPosting: doPostingContent,
		getContent() {
			return this.$refs.tuieditor.invoke('getHtml');
		},
		setContent(content) 	{
			this.text = content;
		},
        buildContentHTML(_html) {
            let contentHTML = _html || this.getContent();

            //contentHTML = contentHTML.match(/\<code.*?\>/g, '<div style="background: grey">').replace(/\<\/code?\>/g, '</div>');
            let html = document.createElement('html');
            let cfg = this.config;

            const createChildElement = (e) => {
                let child = document.createElement('div');
                child.innerHTML = e;
                return child.lastElementChild;
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

            // comment 
            let commentDiv = document.createElement('div');
            commentDiv.style.marginTop = "10px";

            // disqus
            if ( cfg.comment ) {
                if ( cfg.comment.disqus ) {
                    commentDiv.innerHTML += cfg.comment.disqus;
                }

                // utterances
                // 2020. 02. 11
                // utterances 는 스크립트 형태가 아니라 객체로 저장함.
                // 나중에 테마 제작자가 파싱해서 추가해야 함.
                // if ( cfg.comment.utterances ) {
                // commentDiv.innerHTML += cfg.comment.utterances;
                // }

                // facebook
                if ( cfg.comment.facebook ) {
                    commentDiv.innerHTML += cfg.comment.facebook;
                }
            }

            body.appendChild(commentDiv);

            cfg.body.end.forEach(e => {
                let child = createChildElement(e);
                body.appendChild(child);
            });
            html.appendChild(body);
            let outerHTML = html.outerHTML;
            let beautyHTML = beautify.html(outerHTML, true);
            return beautyHTML;
        },
	},
	mounted: function() {
		let gitApi = this.$store.getters.api;
		window.tuieditor = this.$refs.tuieditor;
		if ( !gitApi ) {
			this.$store.commit("api");
		}
		
		if (this.editinfo !== undefined)
		{
			this.editMode = true;
			
			//editInfo 에 title 과 href정보가 있다.
			let decodeObject = Buffer.from(this.editinfo, 'base64').toString('utf8');
			let editInfo = JSON.parse(decodeObject);
			let decodeURI = editInfo.href.replace(/^\//, "");
			let decodeTitle = editInfo.title;

			gitApi.repo.getContents("master", `${decodeURI}index.html`, true).then(res => {
				
				//파일을 업데이트 하기위한 sha와 경로를 받아오고 editor에 내용을 채워준다.
				this.indexSHA = res.sha;
				this.indexPath = decodeURI;
				this.title = decodeTitle;
				this.setContent(res.data);

			});
		}

		let curPName = this.$router.history.current.name;	
		let proms = [];
		let p;
		if ( curPName === "Edit" ) {
			let vContent = document.querySelector('#router-view');
			vContent.style.background = "white";
			
			p = gitApi.repo.getJsonData("posts.json").then(res => {
				this.posts = res.json;
				this.posts_ori = res;

				this.categoryItem = createCategoryItems(this.posts);
				this.c_sel = this.categoryItem[0];
			});
			proms.push(p);
		}
		
		p = gitApi.repo.getJsonData("config.json").then(res => {
			this.config = res.json;
			this.config_ori = res;
		});
		proms.push(p);

		Promise.all(proms).then(() => {
			this.$evt.$emit('page-loading-end');
		});

	},
	data: () => ({
		text: "",
		c_sel: {},
		categoryItem: [],
		menu: false,
		mdText: '',
		htmlText: '',

		indexSHA: null, // index.html에 대한 sha
		indexPath: "",
		title: "",
	}),
};

</script>
