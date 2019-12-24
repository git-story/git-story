<template>
	<v-container fluid>
		<!-- S:Theme Show Dialog -->
		<v-dialog 
			tile
			v-model="dialogShow"
			max-width="600px"
			width="80%">
			<v-card color="grey lighten-3" tile>
				<v-card-title class="text-uppercase" >
					<a  style="text-decoration: none"
						target="_blank"
						class="black--text"
						v-text="sTheme.name.replace('git-story-template-', '')" 
						:href="sTheme.html_url"></a>
				</v-card-title>
				<v-carousel
					:continuous="true"
					:sycle="true"
					:show-arrows="true"
					hide-delimiter-background
					delimitter-icon="mdi-minus"
					height="20rem">
					<v-carousel-item
						color="white"
						v-for="(img, i) in sTheme.imgs"
						style="background-color: white"
						:key="i"
						:src="img.html_url + '?raw=true'">
					</v-carousel-item>
				</v-carousel>
				<v-list two-line color="grey lighten-3">
					<v-list-item>
						<v-list-item-avatar>
							<v-img :src="sTheme.owner.avatar_url"></v-img>
						</v-list-item-avatar>
						<v-list-item-content>
							<a class='grey--text text--darken-3' :href="sTheme.owner.html_url" target="_blank" style="text-decoration: none">
								<v-list-item-title v-text="sTheme.owner.login" class="text-uppercase"></v-list-item-title>
								<v-list-item-subtitle>Author</v-list-item-subtitle>
							</a>
						</v-list-item-content>
						<v-list-item-action>
							<v-checkbox @click="changeTheme" color="success" :input-value="sTheme.used" value :disabled="sTheme.used" :label="sTheme.used ? '사용중' : '테마 사용'"></v-checkbox>
						</v-list-item-action>
					</v-list-item>
				</v-list>
			</v-card>
		</v-dialog>
		<!-- E:Theme Show Dialog -->
		<v-row dense>
			<v-col md="6">
				<h3 class="display-1 white--text">{{ Lang('myblog.template.blog_header') }}</h3>
				<h5 class="subtitle-1 white--text">{{ Lang('myblog.template.blog_content') }}</h5>
			</v-col>
			<v-col md="6"></v-col>
		</v-row>
		<v-row dense>
			<v-col
				v-for="(theme, idx) in themes"
				:key="idx"
				class="px-2 py-12"
				sm="12" md="6" lg="4">
				<v-card class="custom-img" style="width:100%;" tile hover @click="showTheme(idx)">
					<v-img
						:src="theme.cover"
						class="white--text align-end custom-img-height"
						gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)">
						<v-card-title v-text="theme.name.replace('git-story-template-', '')" class="text-uppercase"></v-card-title>
					</v-img>
				</v-card>
			</v-col>
		</v-row>
		<Confirm/>
		<PLoading/>
		<Modal/>
	</v-container>
</template>
<style>
div.v-card.custom-img { }
div.v-card.custom-img div {
	overflow: hidden;
}
div.v-card.custom-img div div.v-image__image--cover {
	transition: transform 0.25s ease;
}
div.v-card.custom-img div div.v-image__image--cover:hover {
	transform: scale(1.2);
}
@media screen and (max-width: 600px) { 
	.custom-img-height {
		height: 15rem;
	}
}
@media screen and (min-width: 600px) and (max-width: 960px) { 
	.custom-img-height {
		height: 25rem;
	}
}
@media screen and (min-width: 960px) and (max-width: 1264px) { 
	.custom-img-height {
		height: 17rem;
	}
}
@media screen and (min-width: 1264px) and (max-width: 1904px) { 
	.custom-img-height {
		height: 20rem;
	}
}
@media screen and (min-width: 1904px) { 
	.custom-img-height {
		height: 23rem;
	}
}
</style>
<script>
import Confirm from '../Util/Confirm';
import PLoading from '../Util/PLoading';
import Modal from '../Util/Modal';
import { findChildByTagName } from '../../modules/common.js';
import Lang from '../../languages/Lang.js';
import EventBus from '../../modules/event-bus.js';

const changeTheme = function() {
	let sTheme = this.sTheme;

	let task = this.$store.getters.task;
	if ( task === true ) {
		let modal = findChildByTagName(this, 'Modal');
		modal.title = Lang('notification');
		modal.content = Lang('inprogress');
		modal.ok = Lang('confirm');
		modal.show();
		return;
	}

	let confirm = findChildByTagName(this, 'Confirm');
	confirm.title = Lang('warning');
	confirm.content = Lang('myblog.template.change_theme');
	confirm.ok = Lang('ok');
	confirm.cancel = Lang('cancel');
	confirm.okClick = () => {
		confirm.hide();

		let ploading = findChildByTagName(this, "PLoading");
		ploading.content = Lang('myblog.template.changing_theme');
		ploading.show();

		this.$store.commit('task', true);

		let gitApi = this.$store.getters.api;
		gitApi.repo.getJsonData("config.json").then(rconfig => {
			let config = rconfig.json;

			let reqFiles = [];
			// remove now theme dependency files
			// add commit request list
			config.theme.files.forEach((l) => {
				reqFiles.push({
					path: l,
					content: null
				});
			});

			gitApi.repo.getJsonData("config.json", sTheme.full_name).
				then(async (res) => {
					let targetConfig = res.json;
					let theme = targetConfig.theme;

					// theme config update
					config.theme = targetConfig.theme;

					// config json commit
					reqFiles.push({
						path: "config.json",
						content: config
					});

					let getThemeReq = [];
					theme.files.forEach(tf => {
						let file = tf;
						if ( file[0] === "/" ) {
							file = file.substr(1);
						}
						getThemeReq.push(gitApi.repo.getData(file, sTheme.full_name));
					});

					let _res = await Promise.all(getThemeReq);
					_res.forEach(r => {
						let data = r.data;
						let file = data.path;
						let content = Buffer.from(data.content, "base64").toString("utf8");
						if ( file[0] === "/" ) {
							file = file.substr(1);
						}
						reqFiles.push({
							"path": file,
							"content": content
						});
					});

					return gitApi.repo.commitFiles("theme change", reqFiles);
				}).
				// eslint-disable-next-line
				then((res) => {
					// eslint-disable-next-line
					console.log("commit done.");
					this.$store.commit('task', false);
					ploading.hide();
				}).
				catch((err) => {
					if ( err.data ) {
						// eslint-disable-next-line
						console.error(err.data);
					} else {
						// eslint-disable-next-line
						console.error(err);
					}
				});
		});
	};
	confirm.show();
}

const showTheme = function(idx) {
	let themes = this.themes;
	this.sTheme = themes[idx];
	this.$forceUpdate();

	let config = this.config;
	let theme = config.theme;

	let name = this.sTheme.name.replace('git-story-template-', '');
	if ( name === theme.name ) {
		this.sTheme.used = true;
	} else {
		this.sTheme.used = false;
	}

	this.sTheme.name = name;

	this.dialogShow = true;
};

export default {
	name: 'BlogTemplate',
	components: {
		Confirm,
		PLoading,
		Modal,
	},
	created: function() {
		let gitApi = this.$store.getters.api;

		gitApi.repo.getJsonData("config.json").then(res => {
			let config = res.json;
			this.config = config;
			this.config_ori = res;
		});

		let Search = gitApi.git.search({ q: 'git-story-template-' });
		Search.forRepositories({ sort: 'updated' }).then(res => {
			let repos = res.data;
			let themes = [];
			let proms = [];
			repos.forEach((r) => {
				if ( r.name.match(/^git-story-template-/) ) {
					themes.push(r);
				}
			});

			this.themes = themes;
			themes.forEach((t) => {
				let p = gitApi.repo.getData("photos", t.full_name).then(res => {
					let data = res.data;
					if ( data.length <= 0 ) {
						let avatar = t.owner.avatar_url;
						t.imgs = [ avatar ];
						t.cover = avatar;
					} else {
						t.imgs = data;
						t.cover = data[0].html_url + "?raw=true";
					}
				}).catch(() => {
					let avatar = t.owner.avatar_url;
					t.imgs = [ { html_url: avatar } ];
					t.cover = avatar;
				}).finally(() => {
					this.$forceUpdate();
				});

				proms.push(p);
			});

			Promise.all(proms).then(() => {
				EventBus.$emit('page-loading-end');
			});
		});
	},
	methods: {
		Lang,
		showTheme,
		changeTheme
	},
	mounted: function() {
	},
	data: function() {
		return {
			themes : [],
			sTheme : {
				name: '',
				html_url: '',
				owner: {
					avatar_url: '',
					html_url: ''
				}
			},
			dialogShow : false
		}
	},
};
</script>
