<template>
	<v-content style="overflow:hidden">
		<!--
		<iframe 
			src=""
			frameBorder="0" 
			crossorigin="anonymous" 
			style="width:100% ; border:0; height:100%;"></iframe>
		-->

		<v-row class="mt-12">
			<!-- S:Side menus -->
			<v-col cols="3" class="pl-12 pr-6">
				<!-- S:Blog Contentes -->
				<v-card class="mx-auto">
					<v-navigation-drawer permanent style="width:100%">
						<v-list-item>
							<v-list-item-content>
								<v-list-item-title class="title">
									{{ Lang('myblog.side.content') }}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>

						<v-divider></v-divider>

						<v-list dense nav>
							<v-list-item link @click="contentChange('BlogList')">
								<v-list-item-icon>
									<v-icon>mdi-playlist-edit</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>
										{{ Lang('myblog.side.manage_post') }}
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item link @click="contentChange('BlogCategory')">
								<v-list-item-icon>
									<v-icon>mdi-shape</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>
										{{ Lang('myblog.side.manage_category') }}
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item link @click="contentChange('BlogTemplate')">
								<v-list-item-icon>
									<v-icon>mdi-layers-triple</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>
										{{ Lang('myblog.side.manage_template') }}
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item link @click="contentChange('BlogSetting')">
								<v-list-item-icon>
									<v-icon>mdi-settings</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>
										{{ Lang('myblog.side.setting_blog') }}
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-navigation-drawer>
				</v-card>
				<!-- S:Blog Contentes -->
			</v-col>
			<!-- E:Side menus -->
			<v-col class="pr-12">
				<!-- <component :is="this.$store.getters.blogContent"></component> -->
				<component :is="this.currentComponent"></component>
			</v-col>
		</v-row>

		<Confirm/>
		<Modal/>
	</v-content>
</template>
<script>
import axios from 'axios';
import Confirm from './Util/Confirm';
import Modal from './Util/Modal';
import { randomNumber, findChildByTagName, routeAssignUrl  } from '../modules/common.js';
import Lang from '../languages/Lang.js';

const categoryList = {
	"BlogList": ()=>import('./MyBlog/BlogList'),
	"BlogCategory": ()=>import('./MyBlog/BlogCategory'),
	"BlogTemplate": ()=>import('./MyBlog/BlogTemplate'),
	"BlogSetting": ()=>import('./MyBlog/BlogSetting'),
};

// 블로그 메뉴 선택시 해당 매뉴 내용을 보여주는 숼스
const contentChangeComponent = function(target, _this) {
	_this = _this || this;
	if ( typeof target === "string" ) {
		let t = categoryList[target];
		if ( t ) {
			if ( typeof _this.currentComponent !== "undefined" ) {
				_this.currentComponent = t;
			}
		}
	}
	_this.$forceUpdate();
};

// 레포지토리 삭제. "유저/레포지토리" 형식으로 매개변수를 받음 그리고 store 정보를 받음
const removeRepository = function(repoFullPath, store) {
	return new Promise((resolve, reject) => {
		if ( repoFullPath && store ) {
			axios({
				url: `${store.getters.config.api}/repos/${repoFullPath}`,
				method: 'delete',
				headers: {
					'Authorization': `Token ${store.getters.token}`
				}
			}).then(res => {
				if ( res.status === 204 ) {
					resolve();
				} else {
					reject();
				}
			}).catch(err => {
				reject(err);
			});
		} else {
			reject();
		}
	});
};

// 레포지토리 생성
// TODO: git page Enable ( https://developer.github.com/v3/repos/pages/#enable-a-pages-site )
// Delete _config.yml file in template 
const createRepository = function(_this = this) {
	if ( !_this ) return;

	let store = _this.$store;
	let user = store.getters.user;
	let modal = findChildByTagName(_this, "Modal");
	let apiUrl = store.getters.config.api;
	//let userName = store.getters.user.name;

	let templates = store.getters.config.templates;
	let template = templates[randomNumber(templates.length)];
	axios({
		url: `${apiUrl}/repos/mobbing/${template}/generate`,
		method: 'post',
		headers: {
			'Authorization': `Token ${store.getters.token}`,
			'Accept': 'application/vnd.github.baptiste-preview+json'
		},
		data: {
			'owner':  user.name,
			'name': `${user.name}.github.io`,
			'description': 'my github blog',
			'private': false
		}
	}).then(() => {
		modal.title = Lang('notification');
		modal.content = Lang('success_create_blog');
		modal.ok = Lang('confirm');
		modal.okClick = () => {
			modal.hide();
		};
		modal.show();
	}).catch(() => {
		modal.title = Lang('error');
		modal.content = Lang('can_not_create_blog');
		modal.ok = Lang('confirm');
		modal.okClick = () => {
			modal.hide();
			routeAssignUrl('/');
		};
		modal.show();
	});
};

export default {
	name: 'MyBlog',
	components: {
		Confirm,
		Modal,
	},
	created: function() {
		//this.$store.commit('blogContent', BlogList);
		contentChangeComponent('BlogList', this);
	},
	methods: {
		contentChange: contentChangeComponent,
		Lang
	},
	mounted: function() {
		//let iframe = document.querySelector('iframe');
		axios({
			url: `${this.$store.getters.config.api}/users/${this.$store.getters.user.name}/repos`,
			method: 'get',
			headers: {
				'Accept': 'application/vnd.github.baptiste-preview+json',
				'Authorization': `Token ${this.$store.getters.token}`
			}
		}).then(res => {
			let confirm = findChildByTagName(this, "Confirm");
			let modal = findChildByTagName(this, "Modal");
			let repos = res.data;
			let ridx = repos.findIndex(r => r.name === `${this.$store.getters.user.name}.github.io`);
			if ( ridx >= 0 ) {
				// 블로그 레포지토리가 있을 때
				// Git Page 가 있는지 확인한다.
				let repo = repos[ridx];
				if ( repo.has_pages ) {
					// Git Page 있음
					//let url = `https://${this.$store.getters.user.name}.github.io`;
					//iframe.src = url;
				} else {
					// Git page 없음
					confirm.title = Lang('notification');
					confirm.content = Lang('have_repo_but');
					confirm.ok = Lang('ok');
					confirm.cancel = Lang('no');
					confirm.okClick = () => {
						// 레포지토리 삭제 후 생성
						removeRepository(repo.full_name, this.$store).then(() => {
							createRepository(this);
						}).catch(() => {
							modal.title = Lang('error');
							modal.content = Lang('can_not_del_repo');
							modal.ok = Lang('confirm');
							modal.okClick = () => {
								modal.hide();
								routeAssignUrl('/');
							};
							modal.show();
						});
						confirm.hide();
					}
					confirm.cancelClick = () => {
						routeAssignUrl('/', this);
						confirm.hide();
					}
					confirm.show();
				}
			} else {
				// 블로그 레포지토리가 없을 때
				confirm.title = Lang('notification');
				confirm.content = Lang('not_have_repo');
				confirm.ok = Lang('ok');
				confirm.cancel = Lang('no'); 
				confirm.okClick = () => {
					// 레포지토리 생성
					confirm.hide();
					createRepository(this);
				}
				confirm.cancelClick = () => {
					routeAssignUrl('/', this);
					confirm.hide();
				}
				confirm.show();
			}
		});
	},
	data: function() {
		return {
			isDialogShow: false,
			currentComponent: null,
		}
	},
};
</script>
