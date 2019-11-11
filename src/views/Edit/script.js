import axios from 'axios';
import { getGitJsonData, genNowDate, findChildByTagName, routeAssignUrl, getObject, commitGitData } from '../modules/common.js';
import PLoading from './Util/PLoading';
import Lang from '../languages/Lang.js';
import beautify from 'js-beautify'
import { toolbarInit, textToolbarInit } from './Edit/toolbarLoad.js';

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
		let posts_sha = this.posts_ori.sha;

		let selectedCategory = this.c_sel.value;
		let category = getObject(posts, selectedCategory);

		let path = category.href;
		let nowDate = genNowDate();

		let title = this.$refs['input-title'].internalValue;


		let coverImg = null;
		if ( coverImg ) {
			// TODO: 글에서 대표 커버 찾아내는 알고리즘 추가
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


		let commitMsg = `📚 [GITSTORY] 📝 POSTING : [${title.toUpperCase()}]`;
		let ploading = findChildByTagName(this, "PLoading");
		ploading.show();

		// posting
		commitGitData(this, axios, '/posts.json', posts, posts_sha, commitMsg)
			.then(() => {
				let contentHTML = buildContentHTML(this);
				let reqUrl = `${path}${nowDate}/index.html`;
				commitGitData(this, axios, reqUrl, contentHTML, null, commitMsg)
					.then(() => {
						ploading.hide();
						routeAssignUrl('/my-blog', this);
					});
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
		Lang,
		changeAlign,
		textBarToggle
	},
	mounted: function() {
		let curPName = this.$router.history.current.name;
		if ( curPName === "Edit" ) {
			let vContent = document.querySelector('#router-view');
			vContent.style.background = "white";

			getGitJsonData(this, axios, "posts.json").then(res => {
				this.posts = res.json;
				this.posts_ori = res;

				this.categoryItem = createCategoryItems(this.posts);
				this.c_sel = this.categoryItem[0];
			});


			getGitJsonData(this, axios, "config.json").then(res => {
				this.config = res.json;
				this.config_ori = res;
			});


			// 커스텀 툴바를, vueditor 와 연결
			toolbarInit(this);
		}
	},
	data: () => ({
		text: "Test",
		c_sel: {},
		categoryItem: [],
		menu: false,
		tb: { //toolbar
			lang: 'bash',
			tag: 'p',
			font: 'arial black',
			fsize: '12px',
			align: ['left', 'center', 'right', 'justify'],
			toggle: {
				textBar: false,
				align:0,
				format: [],
				super_sub: [],
				tColor: '#000000',
				tColorView: [false, false, false],
				bColor: '#000000',
				bColorView: [false, false, false],
			},
		}
	}),
};
