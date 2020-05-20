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
								{{ $t('myblog.category.add_category') }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item link @click="renameCategory">
						<v-list-item-icon>
							<v-icon color="secondary">mdi-pencil-outline</v-icon>
						</v-list-item-icon>

						<v-list-item-content>
							<v-list-item-title>
								{{ $t('myblog.category.modify_category') }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item link @click="deleteCategory">
						<v-list-item-icon>
							<v-icon color="error">mdi-pencil-minus</v-icon>
						</v-list-item-icon>

						<v-list-item-content>
							<v-list-item-title>
								{{ $t('myblog.category.delete_category') }}
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
								@click="createCategory">{{ $t('myblog.category.add_category') }}</v-btn>
							<v-btn
								text
								tile
								color="grey lighten-5"
								class="mr-3"
								@click="renameCategory">{{ $t('myblog.category.modify_category') }}</v-btn>
							<v-btn
								text
								tile
								color="red lighten-1"
								@click="deleteCategory">{{ $t('myblog.category.delete_category') }}</v-btn>
						</v-col>
						<v-col cols="auto">
							<v-btn
								tile
								depressed
								color="success"
								@click="applyCategory">{{ $t('apply') }}</v-btn>
						</v-col>
					</v-row>
				</v-card>
				<v-container class="pa-0 ma-0 d-md-none">
					<v-row class="pa-0 ma-0" align="center">
						<v-col class="pa-0 ma-0" style="color: white">
							<v-icon color="white">mdi-book-minus-multiple</v-icon>&nbsp;
							{{ $t('myblog.side.manage_category') }}
						</v-col>
						<v-col class="pa-0 ma-0" align="right">
							<v-btn
								color="success"
								tile
								@click="applyCategory">{{ $t('apply') }}</v-btn>
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
		<IModal ref="IModal"/>
		<PLoading ref="PLoading"/>
	</v-container>
</template>
<script>
import { findChildByTagName, getObject } from '../../modules/common.js';
import IModal from '../Util/IModal';
import PLoading from '../Util/PLoading';

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

const createCategory = function() {
	let active = this.active;

	let vMobile = this.vMobile;
	if ( vMobile === true ) {
		this.dialog = false;
		this.active = [];
	}

	let imodal = findChildByTagName(this, "IModal");
	if ( imodal ) {
		imodal.title = this.$t('myblog.category.add_category');
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

			this.updateCategory(posts);

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
        this.$modal({
            title: this.$t("notification"),
            content: this.$t("myblog.category.not_selected"),
            textOk: this.$t("confirm"),
        });
		return;
	}

	let posts = this.posts;
	let search = active[0];
	let { k, d } = getObject(posts, search, 1);

	let imodal = findChildByTagName(this, "IModal");
	if ( imodal ) {
		imodal.title = this.$t('myblog.category.modify_category');
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

			this.updateCategory(posts);

			imodal.hide();
		}
		imodal.show();
	}
};


const applyCategory = function() {
	let posts = this.posts;
	let commitMsg = `📚 [GITSTORY] 📜 CATEGORY UPDATE : [posts.json]`;
	let gitApi = this.$store.getters.api;

	let task = this.$store.getters.task;
	if ( task === true ) {
        this.$modal({
            title: this.$t("notification"),
            content: this.$t("inprogress"),
            textOk: this.$t("confirm"),
        });
		return;
	}

	this.$store.commit('task', true);

	let ploading = findChildByTagName(this, "PLoading");
	ploading.content = this.$t('applying');
	ploading.show();
	gitApi.repo.commitFiles(commitMsg, [{
		"path": "posts.json",
		"content": posts
	}]).then(() => {
		ploading.hide();
	}).catch(() => {
		ploading.hide();
	}).finally(() => {
		this.$store.commit('task', false);
	});
};

export default {
	name: 'BlogCategory',
	components: {
		IModal,
		PLoading,
	},
	created: function() {
		this.vMobile = this.$store.getters.vMobile;
		this.vMobile = true;
		let gitApi = this.$store.getters.api;
		gitApi.repo.getJsonData("posts.json").
			then(res => {
				let posts = res.json;
				this.posts_ori = res;
				this.updateCategory(posts);

				this.$evt.$emit('page-loading-end');
			});
	},
	methods: {
		createCategory,
		renameCategory,
		deleteCategory() {
			let active = this.active;

			let vMobile = this.vMobile;
			if ( vMobile === true ) {
				this.dialog = false;
				this.active = [];
			}

			if ( active.length <= 0 ) {
                this.$modal({
                    title: this.$t("notification"),
                    content: this.$t("myblog.category.not_selected"),
                    textOk: this.$t("confirm"),
                });
				return;
			}

			let posts = this.posts;
			let search = active[0];
			let { k, d } = getObject(posts, search, 1);

			this.$confirm({
				title: this.$t('warning'),
				content: `[${k}] ` + this.$t('myblog.category.delete_check'),
				textOk: this.$t('ok'),
				textCancel: this.$t('no'),
				ok: () => {
					delete d[k];
					this.updateCategory(posts);
				},
			});
		},
		applyCategory,
		outClick() {
			let vMobile = this.vMobile;
			if ( vMobile === true ) {
				this.active = [];
			}
		},
        updateCategory(posts = {}) {
            let categoryItems = createCategoryItems(posts);
            this.posts = posts;
            this.items = categoryItems;
        },

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
