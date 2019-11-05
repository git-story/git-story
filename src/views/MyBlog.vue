<template>
	<v-content style="overflow:hidden">
		<v-row class="mt-12">
			<!-- S:Side menus -->
			<v-col cols="3" align="right" class="pl-12 pr-6">
				<!-- S:New Posting -->
				<v-row>
					<v-col class="pa-0"></v-col>
					<v-col md="12" lg="6" class="pa-0">
						<v-btn @click="routeAssignUrl('/edit')" block class="mb-3" color="grey darken-3" dark hover large>{{ Lang('myblog.newpost') }}</v-btn>
						<!-- E:New Posting -->
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
				</v-row>
			</v-col>
			<!-- E:Side menus -->
			<v-col class="pr-12 pt-0">
				<!-- <component :is="this.$store.getters.blogContent"></component> -->
				<component :is="this.currentComponent"></component>
			</v-col>
		</v-row>

		<Confirm/>
		<Modal/>
		<PLoading/>
	</v-content>
</template>
<script>
import axios from 'axios';
import Confirm from './Util/Confirm';
import Modal from './Util/Modal';
import PLoading from './Util/PLoading';
import { randomNumber, findChildByTagName, routeAssignUrl, removeRepository, getGitJsonData  } from '../modules/common.js';
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

const authorUpdate = (_this = this) => {
	return new Promise((resolve, reject) => {
		getGitJsonData(_this, axios, "config.json").then((res) => {
			let config = res.json;
			let user = _this.$store.getters.user;
			if ( config['author'] === "" ) {
				config['author'] = user.name;

				let configStr = JSON.stringify(config, null, '\t');
				let b64config = Buffer.from(configStr, "utf8").toString('base64');


				let apiUrl = _this.$store.getters.config.api;
				let reqUrl = `${apiUrl}/repos/${user.name}/${user.name}.github.io/contents/config.json`;
				axios({
					url: reqUrl,
					method: 'put',
					headers: {
						'Authorization': `Token ${_this.$store.getters.token}`
					},
					data: {
						message: `[GITSTORY] author update : config.json`,
						content: b64config,
						sha: res.sha
					}
				}).then(() => {
					resolve();
				}).catch(reject);
			}
		}).catch(() => {
		});
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
	let ploading = findChildByTagName(_this, "PLoading");
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
		ploading.hide();
		modal.title = Lang('notification');
		modal.content = Lang('success_create_blog');
		modal.ok = Lang('confirm');
		modal.okClick = () => {
			modal.hide();
			location.reload();
		};
		modal.show();
	}).catch(() => {
		ploading.hide();
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
		PLoading
	},
	created: function() {
		//this.$store.commit('blogContent', BlogList);
		contentChangeComponent('BlogList', this);
	},
	methods: {
		contentChange: contentChangeComponent,
		Lang,
		routeAssignUrl
	},
	mounted: function() {
		let wallpapers = this.$store.getters.config.wallpapers;
		let wnum = randomNumber(wallpapers.length);

		console.log(wallpapers[wnum]);
		let vContent = document.querySelector('main.v-content');
		vContent.style.background = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${wallpapers[wnum]}')`;
		vContent.style.backgroundRepeat = "no-repeat";
		vContent.style.backgroundPosition = "center center";
		vContent.style.backgroundSize = "cover";


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
			let ploading = findChildByTagName(this, "PLoading");

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
					getGitJsonData(this, axios, "posts.json").then(() => {
						// 모두 정상적으로 있음.
						authorUpdate(this);	
					}).catch(() => {
						// posts.json 이 없을 때 
						confirm.title = Lang('notification');
						confirm.content = Lang('have_repo_but');
						confirm.ok = Lang('ok');
						confirm.cancel = Lang('no');
						confirm.okClick = () => {
							// 레포지토리 삭제 후 생성
							ploading.show();
							removeRepository(repo.full_name, this.$store, axios).then(() => {
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
					});
				} else {
					// Git page 없음
					confirm.title = Lang('notification');
					confirm.content = Lang('have_repo_but');
					confirm.ok = Lang('ok');
					confirm.cancel = Lang('no');
					confirm.okClick = () => {
						// 레포지토리 삭제 후 생성
						ploading.show();
						removeRepository(repo.full_name, this.$store, axios).then(() => {
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
					ploading.show();
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
