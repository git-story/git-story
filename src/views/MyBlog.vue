<template>
	<v-content>
		<v-row class="mt-12 ml-0 mr-0" style="width: 100%">
			<!-- S:SM Sidebar -->
			<BlogSideBar />
			<!-- E:SM Sidebar -->

			<!-- S:Side menus -->
			<v-col md="3" align="right" class="pl-12 d-none d-md-flex">
				<!-- S:New Posting -->
				<v-row>
					<v-col class="pa-0 d-none d-lg-flex"></v-col>
					<v-col sm="12" md="12" lg="8" xl="6" class="pa-0">
						<v-btn tile @click="routeAssignUrl('/edit')" block color="grey darken-3" dark hover large>{{ Lang('myblog.newpost') }}</v-btn>
						<!-- E:New Posting -->
						<!-- S:Blog Contentes -->
						<v-card tile class="mx-auto mt-3">
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
								</v-list>
							</v-navigation-drawer>
						</v-card>
						<!-- E:Blog Contentes -->
						<!-- S:Blog Setting -->
						<v-card tile class="mx-auto mt-3">
							<v-navigation-drawer permanent style="width:100%">
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title class="title">
											{{ Lang('myblog.side.setting_blog') }}
										</v-list-item-title>
									</v-list-item-content>
								</v-list-item>

								<v-divider></v-divider>

								<v-list dense nav>
									<!-- S:Blog Template -->
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
									<!-- E:Blog Template -->
									<!-- S:Blog Include -->
									<v-list-item link @click="contentChange('BlogInclude')">
										<v-list-item-icon>
											<v-icon>mdi-book-open-variant</v-icon>
										</v-list-item-icon>

										<v-list-item-content>
											<v-list-item-title>
												{{ Lang('myblog.side.setting_include') }}
											</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
									<!-- E:Blog Include -->
									<!-- S:Blog Comment -->
									<v-list-item link @click="contentChange('BlogComment')">
										<v-list-item-icon>
											<v-icon>mdi-comment-multiple</v-icon>
										</v-list-item-icon>

										<v-list-item-content>
											<v-list-item-title>
												{{ Lang('myblog.side.setting_comment') }}
											</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
									<!-- E:Blog Comment -->
									<!-- S:Blog ETC -->
									<v-list-item link @click="contentChange('BlogSetting')">
										<v-list-item-icon>
											<v-icon>mdi-settings</v-icon>
										</v-list-item-icon>

										<v-list-item-content>
											<v-list-item-title>
												{{ Lang('myblog.side.setting_etc') }}
											</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
									<!-- E:Blog ETC -->
								</v-list>
							</v-navigation-drawer>
						</v-card>
						<!-- E:Blog Setting -->
					</v-col>
				</v-row>
			</v-col>
			<!-- E:Side menus -->
			<v-col class="pr-12 pl-12 pt-0" md="9">
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
import { randomNumber, findChildByTagName, routeAssignUrl, removeRepository, getGitJsonData, mobileCheck, commitGitData  } from '../modules/common.js';
import Lang from '../languages/Lang.js';
import BlogSideBar from './MyBlog/BlogSideBar';
import EventBus from '../modules/event-bus.js';

const categoryList = {
	"BlogList": ()=>import('./MyBlog/BlogList'),
	"BlogCategory": ()=>import('./MyBlog/BlogCategory'),
	"BlogTemplate": ()=>import('./MyBlog/BlogTemplate'),
	"BlogInclude": ()=>import('./MyBlog/BlogInclude'),
	"BlogComment": ()=>import('./MyBlog/BlogComment'),
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

				let commitMsg = "📚 [GITSTORY] 👤 AUTHOR UPDATE : [config.json]";

				commitGitData(_this, axios, '/config.json', config, res.sha, commitMsg)
					.then((res) => {
						resolve(res);
					}).catch((err) => {
						reject(err);
					});
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
			'description': '📚 [GITSTORY] 🚥 Writing post easier and faster',
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
		PLoading,
		BlogSideBar
	},
	created: function() {
		//this.$store.commit('blogContent', BlogList);
		contentChangeComponent('BlogList', this);
		EventBus.$on('content-change', (content) => {
			contentChangeComponent(content, this);
		});
	},
	methods: {
		contentChange: contentChangeComponent,
		Lang,
		routeAssignUrl
	},
	mounted: function() {
		let curPName = this.$router.history.current.name;
		if ( curPName === "MyBlog" ) {
			let wallpapers = this.$store.getters.config.wallpapers;
			let wnum = randomNumber(wallpapers.length);

			// vMobile check
			this.vMobile = mobileCheck();
			if ( this.vMobile === true ) {
				wallpapers = this.$store.getters.config['m-wallpapers'];
				wnum = randomNumber(wallpapers.length);
			}

			let vContent = document.querySelector('#router-view');
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
		}
	},
	data: function() {
		return {
			isDialogShow: false,
			currentComponent: null,
			vMobile: false
		}
	},
};
</script>
