<template>
	<v-container class="pa-0">
		<v-dialog
			v-model="dialog"
			width="70%"
			max-width="500px"
			@click:outside="outClick()"
			class="pa-0">
			<v-card class="ma-0 pa-0">
				<v-card-text class="ma-0 pa-0">
					<v-list-item link @click="createCategory">
						<v-list-item-icon>
							<v-icon color="info">mdi-pencil-plus</v-icon>
						</v-list-item-icon>

						<v-list-item-content>
							<v-list-item-title>
								{{ Lang('myblog.category.add_category') }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item link @click="renameCategory">
						<v-list-item-icon>
							<v-icon color="secondary">mdi-pencil-outline</v-icon>
						</v-list-item-icon>

						<v-list-item-content>
							<v-list-item-title>
								{{ Lang('myblog.category.modify_category') }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item link @click="deleteCategory">
						<v-list-item-icon>
							<v-icon color="error">mdi-pencil-minus</v-icon>
						</v-list-item-icon>

						<v-list-item-content>
							<v-list-item-title>
								{{ Lang('myblog.category.delete_category') }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-card-text>
			</v-card>
		</v-dialog>
		<v-row>
			<v-col>
				<v-card class="pa-2 d-none d-md-flex" color="transparent" tile flat>
					<v-row>
						<v-col cols="auto" class="mr-auto">
							<v-btn 
								text 
								tile
								color="light-blue lighten-1"
								class="mr-3"
								@click="createCategory">{{ Lang('myblog.category.add_category') }}</v-btn>
							<v-btn
								text
								tile
								color="grey lighten-5"
								class="mr-3"
								@click="renameCategory">{{ Lang('myblog.category.modify_category') }}</v-btn>
							<v-btn
								text
								tile
								color="red lighten-1"
								@click="deleteCategory">{{ Lang('myblog.category.delete_category') }}</v-btn>
						</v-col>
						<v-col cols="auto">
							<v-btn
								tile
								depressed
								color="success"
								@click="applyCategory">{{ Lang('apply') }}</v-btn>
						</v-col>
					</v-row>
				</v-card>
				<v-container class="pa-0 ma-0 d-md-none">
					<v-row class="pa-0 ma-0" align="center">
						<v-col class="pa-0 ma-0" style="color: white">
							<v-icon color="white">mdi-book-minus-multiple</v-icon>&nbsp;
							{{ Lang('myblog.side.manage_category') }}
						</v-col>
						<v-col class="pa-0 ma-0" align="right">
							<v-btn
								color="success"
								tile
								@click="applyCategory">{{ Lang('apply') }}</v-btn>
						</v-col>
					</v-row>
				</v-container>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<v-card class="pa-5" color="transparent" tile flat>
					<v-treeview
						dark
						:items="items"
						:active.sync="active"
						activatable	
						color="grey lighten-2"
						open-all
						transition >
					</v-treeview>
				</v-card>
			</v-col>
		</v-row>
		<IModal/>
		<Confirm/>
		<PLoading/>
		<Modal/>
	</v-container>
</template>
<script>
import { findChildByTagName, getObject } from '../../modules/common.js';
import IModal from '../Util/IModal';
import Confirm from '../Util/Confirm';
import PLoading from '../Util/PLoading';
import Modal from '../Util/Modal';
import Lang from '../../languages/Lang.js';

const createCategoryItems = function(posts, id="") {
	let keys = Object.keys(posts);
	let obj = [];

	keys.forEach((k) => {
		let cat = posts[k];
		let po  = { // push object target
			id: id+k,
			name: k
		};

		let subs = cat.sub;
		let skeys = Object.keys(subs);
		if ( skeys.length > 0 ) {
			let next_id = `${id}${k}.sub.`;
			let child = createCategoryItems(subs, next_id);
			po['children'] = child;
		}

		obj.push(po);
	});

	return obj;
};

const updateCategory = function(_this = this, posts = {}) {
	let categoryItems = createCategoryItems(posts);
	_this.posts = posts;
	_this.items = categoryItems;
};

const createCategory = function() {
	let active = this.active;

	let vMobile = this.vMobile;
	if ( vMobile === true ) {
		this.dialog = false;
		this.active = [];
	}

	let imodal = findChildByTagName(this, "IModal");
	if ( imodal ) {
		imodal.title = Lang('myblog.category.add_category');
		imodal.inputText = "";
		imodal.okClick = () => {
			let posts = this.posts;
			let parent = posts;
			let category = imodal.inputText;

			if ( active.length > 0 ) {
				let search = active[0];
				parent = getObject(posts, search);
				if ( !parent ) {
					imodal.hide();
					return;
				}

				parent.sub[category] = {
					"href" : `${parent.href}${category}/`,
					"sub": {},
					"posts" : []
				}
			} else {
				parent[category] = {
					"href" : `/posts/${category}/`,
					"sub": {},
					"posts" : []
				}
			}

			updateCategory(this, posts);

			imodal.hide();
		};
		imodal.show();
	}
};

const allChangeHref = (obj, ori, dst) => {
	if ( Array.isArray(obj) ) {
		obj.forEach(o => {
			if ( o.href ) {
				o.href = o.href.replace(ori, dst);
			}
		});
	} else if ( typeof obj === "object" ) {
		if ( obj.href ) {
			obj.href = obj.href.replace(ori, dst);
			if ( typeof obj.sub === "object" ) {
				let keys = Object.keys(obj.sub);
				keys.forEach(k => {
					allChangeHref(obj.sub[k], ori, dst);
				});
			}

			allChangeHref(obj.posts, ori, dst);
		}
	}
}

const renameCategory = function() {
	let active = this.active;

	let vMobile = this.vMobile;
	if ( vMobile === true ) {
		this.dialog = false;
		this.active = [];
	}

	if ( active.length <= 0 ) {
		let modal = findChildByTagName(this, "Modal");
		modal.title = Lang("notification");
		modal.content = Lang("myblog.category.not_selected");
		modal.ok = Lang("confirm");
		modal.show();
		return;
	}

	let posts = this.posts;
	let search = active[0];
	let { k, d } = getObject(posts, search, 1);

	let imodal = findChildByTagName(this, "IModal");
	if ( imodal ) {
		imodal.title = Lang('myblog.category.modify_category');
		imodal.inputText = k;
		imodal.okClick = () => {
			let rename = imodal.inputText;
			if ( rename === k ) {
				imodal.hide();
				return;
			}

			let target = d[k];
			let oriHref = target.href;
			let regex = new RegExp(`${k.toLowerCase()}(?=/$)`);
			target.href = target.href.replace(regex, rename.toLowerCase());
			allChangeHref(target, oriHref, target.href);

			d[rename] = d[k];
			delete d[k];

			updateCategory(this, posts);

			imodal.hide();
		}
		imodal.show();
	}
};

const deleteCategory = function() {
	let active = this.active;

	let vMobile = this.vMobile;
	if ( vMobile === true ) {
		this.dialog = false;
		this.active = [];
	}

	if ( active.length <= 0 ) {
		let modal = findChildByTagName(this, "Modal");
		modal.title = Lang("notification");
		modal.content = Lang("myblog.category.not_selected");
		modal.ok = Lang("confirm");
		modal.show();
		return;
	}

	let posts = this.posts;
	let search = active[0];
	let { k, d } = getObject(posts, search, 1);

	let confirm = findChildByTagName(this, "Confirm");

	if ( confirm ) {
		confirm.title = Lang('warning');
		confirm.content = `[${k}] ` + Lang('myblog.category.delete_check');
		confirm.ok = Lang('ok');
		confirm.cancel = Lang('no');
		confirm.okClick = () => {
			delete d[k];
			updateCategory(this, posts);
			confirm.hide();
		}
		confirm.show();
	}
};

const applyCategory = function() {
	let posts = this.posts;
	let commitMsg = `📚 [GITSTORY] 📜 CATEGORY UPDATE : [posts.json]`;
	let gitApi = this.$store.getters.api;

	let ploading = findChildByTagName(this, "PLoading");
	ploading.show();
	gitApi.repo.commitFiles(commitMsg, [{
		"path": "posts.json",
		"content": posts
	}]).then(() => {
		ploading.hide();
	}).catch(() => {
		ploading.hide();
	});
};

export default {
	name: 'BlogCategory',
	components: {
		IModal,
		Confirm,
		PLoading,
		Modal
	},
	created: function() {
		this.vMobile = this.$store.getters.vMobile;
		this.vMobile = true;
		let gitApi = this.$store.getters.api;
		gitApi.repo.getJsonData("posts.json").
			then(res => {
				let posts = res.json;
				this.posts_ori = res;
				updateCategory(this, posts);
			});
	},
	methods: {
		Lang,
		createCategory,
		renameCategory,
		deleteCategory,
		applyCategory,
		outClick: function() {
			let vMobile = this.vMobile;
			if ( vMobile === true ) {
				this.active = [];
			}
		}
	},
	mounted: function() {
	},
	data: function() {
		return { 
			active:[],
			items:[],
			dialog: false,
			vMobile: false
		};
	},
	computed: {
		selected () {
			let active = this.active;
			if ( active.length > 0 ) {
				if ( this.vMobile === true ) {
					// eslint-disable-next-line
					this.dialog = true;
				}
			}
			return true;
		}
	},
	watch: {
		// for call computed function
		selected: () => {}
	}
};
</script>
