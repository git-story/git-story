import axios from 'axios';
import { genNowDate, findChildByTagName, routeAssignUrl, getObject, removePost } from '../modules/common.js';
import PLoading from './Util/PLoading';
import Lang from '../languages/Lang.js';
import beautify from 'js-beautify'
import { toolbarInit, textToolbarInit, tagChange, fontChange, sizeChange, textFrontColorChange, textBackColorChange } from './Edit/toolbarLoad.js';

const changeAlign = function() {
	if ( this.tb.toggle.align === 3 ) {
		this.tb.toggle.align = 0;
	} else {
		this.tb.toggle.align += 1;
	}
};

const buildContentHTML = function(_this = this) {
	let contentHTML = _this.$refs.vueditor.getContent();
	let html = document.createElement('html');
	let cfg = _this.config;

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
	if ( cfg.comment.disqus ) {
		commentDiv.innerHTML += cfg.comment.disqus;
	}
	
	// utterances
	if ( cfg.comment.utterances ) {
		commentDiv.innerHTML += cfg.comment.utterances;
	}

	// facebook
	if ( cfg.comment.facebook ) {
		commentDiv.innerHTML += cfg.comment.facebook;
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
};

const doPostingContent = function() {
	// get posts.json
	if ( this.posts ) {
		let posts = this.posts;

		let selectedCategory = this.c_sel.value;

		// 실제 파일은 카테고리와 무관하게
		// 디렉토리를 더 나누지 않고 /posts 아래 바로 위치하도록 수정
		// let path = category.href;
		let path = "/posts/";
		let nowDate = genNowDate();
		
		let requsetBase = `${path}${nowDate}/`
		
		if (this.indexPath.length > 0) { // 편집하는 경우 기존 경로로
			requsetBase = this.indexPath;
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
			removePost({"title": this.title, "href": requsetBase}, axios, this, false);
		}
		let category = getObject(posts, selectedCategory);
		category.posts.push({
			cover: coverImg,
			href: requsetBase,
			title: this.title,
		});

		let commitMsg = `📚 [GITSTORY] 📝 POSTING : [${this.title.toUpperCase()}]`;
		let ploading = findChildByTagName(this, "PLoading");
		ploading.show();

		// posting
		let gitApi = this.$store.getters.api;
		let contentHTML = buildContentHTML(this);
		let reqUrl = requsetBase + 'index.html';
		gitApi.repo.commitFiles(commitMsg, [
			{
				"path": "posts.json",
				"content": posts
			}, 
			{
				"path": reqUrl,
				"content": contentHTML
			}
		]).then(() => {
			ploading.hide();
			routeAssignUrl('/my-blog', this);
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

const textBarToggle = function() {
	if ( this.tb.toggle.textBar === true ) {
		this.tb.toggle.textBar = false;
	} else {
		this.tb.toggle.textBar = true;
		// 즉시 실행하면 엘리먼트가 추가되기 전에 실행되어서 동작 안 함
		setTimeout( textToolbarInit, 100 );
	}
};

const createTables = function() {
	let table = this.tb.table;
	let editor = this.$refs.vueditor;

	editor.createTable(table.row, table.col);
};

export default {
	name: 'Edit',
	components: {
		PLoading
	},

	props: ['editinfo'],
	methods: {
		doPosting: doPostingContent,
		getContent : function() {
			this.text = this.$refs.vueditor.getContent();
		},
		setContent : function(content) 	{
			this.$refs.vueditor.setContent(content);
		},
		Lang,
		changeAlign,
		textBarToggle,
		createTables,
		tagChange,
		fontChange,
		sizeChange,
		textFrontColorChange,
		textBackColorChange
	},
	mounted: function() {
		let gitApi = this.$store.getters.api;
		
		if (this.editinfo !== undefined)
		{
			this.editMode = true;
			
			//editInfo 에 title 과 href정보가 있다.
			let decodeObject = Buffer.from(this.editinfo, 'base64').toString('utf8');
			let editInfo = JSON.parse(decodeObject);
			let decodeURI = editInfo.href;
			let decodeTitle = editInfo.title;

			gitApi.repo.getContents(`${decodeURI}index.html`).then(res => {
				
				//파일을 업데이트 하기위한 sha와 경로를 받아오고 editor에 내용을 채워준다.
				this.indexSHA = res.sha;
				this.indexPath = decodeURI;
				this.title = decodeTitle;
				this.setContent(res.decodeData);

			});
		}

		let curPName = this.$router.history.current.name;	
		if ( curPName === "Edit" ) {
			let vContent = document.querySelector('#router-view');
			vContent.style.background = "white";
			
			gitApi.repo.getJsonData("posts.json").then(res => {
				this.posts = res.json;
				this.posts_ori = res;

				this.categoryItem = createCategoryItems(this.posts);
				this.c_sel = this.categoryItem[0];
			});
		}
		
		gitApi.repo.getJsonData("config.json").then(res => {
			this.config = res.json;
			this.config_ori = res;
		});

		// 커스텀 툴바를, vueditor 와 연결
		toolbarInit(this);

	},
	data: () => ({
		text: "Test",
		c_sel: {},
		categoryItem: [],
		menu: false,

		indexSHA: null, // index.html에 대한 sha
		indexPath: "",
		title: "",		
		true_:  true,

		tb: { //toolbar
			lang: 'bash',
			// tag: 'p',
			// font: 'arial black',
			// fsize: '12px',
			align: ['left', 'center', 'right', 'justify'],
			table: {
				rules: [
					(value) => {
						if ( value === undefined ) {
							return "please-input";
						}

						if ( value.toString().match(/[^0-9]/g) ) {
							return Lang("editor.table.only-number");
						}
						return true;
					}
				],
				row: 0,
				col: 0,
			},
			tag: {
				cur: '',
				list: [],
			},
			font: {
				cur: '',
				list: [],
			},
			size: {
				cur: '',
				list: [],
			},
			toggle: {
				textBar: false,
				align:0,
				format: [],
				super_sub: [],
				tColor: '#000000',
				tColorView0: false,
				tColorView1: false,
				tColorView2: false,
				bColor: '#000000',
				bColorView0: false,
				bColorView1: false,
				bColorView2: false,
				tableDialog: false
			},
		}
	}),
};
