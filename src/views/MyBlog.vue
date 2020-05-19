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
						<v-btn tile @click="$assign('/edit')" block color="blue-grey darken-3" dark hover large>{{ $t('myblog.newpost') }}</v-btn>
						<!-- E:New Posting -->
						<!-- S:Blog Contentes -->
						<v-card tile class="mx-auto mt-3" style="background: rgba(80, 80, 80, 0.3)">
							<v-navigation-drawer permanent dark style="width:100%" color="transparent">
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title class="title">
											{{ $t('myblog.side.content') }}
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
												{{ $t('myblog.side.manage_post') }}
											</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
									<v-list-item link @click="contentChange('BlogCategory')">
										<v-list-item-icon>
											<v-icon>mdi-shape</v-icon>
										</v-list-item-icon>

										<v-list-item-content>
											<v-list-item-title>
												{{ $t('myblog.side.manage_category') }}
											</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
								</v-list>
							</v-navigation-drawer>
						</v-card>
						<!-- E:Blog Contentes -->
						<!-- S:Blog Setting -->
						<v-card tile class="mx-auto mt-3" style="background: rgba(80, 80, 80, 0.3)">
							<v-navigation-drawer permanent style="width:100%" color="transparent" dark>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title class="title">
											{{ $t('myblog.side.setting_blog') }}
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
												{{ $t('myblog.side.manage_template') }}
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
												{{ $t('myblog.side.setting_include') }}
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
												{{ $t('myblog.side.setting_comment') }}
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
												{{ $t('myblog.side.setting_etc') }}
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
				<component :is="this.currentComponent.t"></component>
			</v-col>
		</v-row>

        <!--
		<Confirm
            :title="confirm.title"
            :content="confirm.content"
            :open.sync="confirm.open"
            :text-ok="confirm.textOk"
            :text-cancel="confirm.textCancel"
            @cancel="confirm.cancel"
            @ok="confirm.ok"/>
        -->
		<Modal ref="Modal"/>
		<PLoading ref="PLoading"/>
	</v-content>
</template>
<script>
import Modal from './Util/Modal';
import PLoading from './Util/PLoading';
import { randomNumber, findChildByTagName, mobileCheck  } from '../modules/common.js';
import BlogSideBar from './MyBlog/BlogSideBar';

const categoryList = {
	"BlogList": ()=>import('./MyBlog/BlogList'),
	"BlogCategory": ()=>import('./MyBlog/BlogCategory'),
	"BlogTemplate": ()=>import('./MyBlog/BlogTemplate'),
	"BlogInclude": ()=>import('./MyBlog/BlogInclude'),
	"BlogComment": ()=>import('./MyBlog/BlogComment'),
	"BlogSetting": ()=>import('./MyBlog/BlogSetting'),
};


export default {
	name: 'MyBlog',
	components: {
		Modal,
		PLoading,
		BlogSideBar
	},
	created: function() {
		//this.$store.commit('blogContent', BlogList);
		this.contentChange('BlogList');
		this.$evt.$on('content-change', (content) => {
			this.contentChange(content);
		});
		this.$evt.$on('myblog.call-mounted', () => {
			this.loadBlog();
		});
	},
	methods: {
        contentChange(target) {
            if ( typeof target === "string" ) {
                let t = categoryList[target];
                if ( t ) {
                    if ( this.currentComponent ) {
                        if ( this.currentComponent.target !== target ) {
                            this.$evt.$emit('page-loading-start');
                            this.currentComponent = { target, t };
                        }
                    }
                }
            }
            this.$forceUpdate();
        },
        authorUpdate() {
            return new Promise((resolve, reject) => {
                let gitApi = this.$store.getters.api;
                gitApi.repo.getJsonData("config.json").then((res) => {
                    let config = res.json;
                    let user = this.$store.getters.user;
                    if ( config['author'] === "" ) {
                        config['author'] = user.name;

                        let commitMsg = "📚 [GITSTORY] 👤 AUTHOR UPDATE : [config.json]";

                        gitApi.repo.commitFiles(commitMsg, [{
                            "path": "config.json",
                            "content": config 
                        }]).then(resolve).catch(reject);
                    }
                }).catch(() => {
                });
            });
        },
        createRepository() {
            let gitApi = this.$store.getters.api;
            let user = this.$store.getters.user;
            let templates = this.$store.getters.config.templates;
            let template = templates[randomNumber(templates.length)];

            let modal = findChildByTagName(this, "Modal");
            let ploading = findChildByTagName(this, "PLoading");

            gitApi.repo.createTemplateRepo(template, {
                "owner": user.name,
                "name" : `${user.name}.github.io`,
                "description": '📚 [GITSTORY] 🚥 Writing post easier and faster',
                "private": false
            }).then(() => {
                // 레포지토리 생성 성공
                ploading.hide();
                modal.title = this.$t('notification');
                modal.content = this.$t('success_create_blog');
                modal.ok = this.$t('confirm');
                modal.okClick = () => {
                    modal.hide();
                    this.$evt.$emit('myblog.list.reload');
                };
                modal.show();
            }).catch(() => {
                modal.title = this.$t('error');
                modal.content = this.$t('can_not_del_repo');
                modal.ok = this.$t('confirm');
                modal.okClick = () => {
                    modal.hide();
                    this.$assign('/');
                };
                modal.show();
            });
        },
        loadBlog() {
            let gitApi = this.$store.getters.api;
            gitApi.user.listRepos().
                then((res) => {
                    let ploading = findChildByTagName(this, "PLoading");
                    ploading.content = this.$t('creating_blog');

                    let repos = res.data;
                    let ridx = repos.findIndex(r => r.name.toLowerCase() === `${this.$store.getters.user.name}.github.io`.toLowerCase());
                    if ( ridx >= 0 ) {
                        // 블로그 레포지토리가 있을 때
                        // Git Page 가 있는지 확인한다.
                        let repo = repos[ridx];
                        if ( repo.has_pages ) {
                            // Git Page 있음
                            gitApi.repo.getJsonData("posts.json").then(() => {
                                // 모두 정상적으로 있음.
                                this.authorUpdate();	
                            }).catch(() => {
                                // posts.json 이 없을 때 
                                this.$confirm({
                                    title: this.$t('notification'),
                                    content: this.$t('have_repo_but'),
                                    textOk: this.$t('ok'),
                                    textCancel: this.$t('no'),
                                    ok: () => {
                                        // 레포지토리 삭제 후 생성
                                        ploading.show();
                                        gitApi.repo.deleteRepo().
                                            then(() => {
                                                return this.createRepository();
                                            });
                                    },
                                    cancel: () => {
                                        this.$assign('/');
                                    },
                                });
                            });
                            // don't have posts.json 
                        } // repo has pages
                    } else {
                        // 블로그 레포지토리가 없을 때
                        this.$confirm({
                            title: this.$t('notification'),
                            content: this.$t('not_have_repo'),
                            textOk: this.$t('ok'),
                            textCancel: this.$t('no'),
                            ok: () => {
                                // 레포지토리 삭제 후 생성
                                ploading.show();
                                this.createRepository();
                            },
                            cancel: () => {
                                this.$assign('/');
                            },
                        });
                    }
                }); // git api listRepos
        },
    },
    mounted: function() {
        let curPName = this.$router.history.current.name;
        if ( curPName === "MyBlog" ) {
            this.$store.commit("api");

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

            this.loadBlog(this);
        } // if cur page MyBlog
    },
    data() {
        return {
            isDialogShow: false,
            currentComponent: { target: '', t: null },
            vMobile: false,
            confirm: {
                title: '',
                content: '',
                open: false,
                textOk: this.$t('ok'),
                textCancel: this.$t('cancel'),
                ok: () => {},
                cancel: () => {},
            },
        }
    },
};
</script>
