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
				class="pa-12"
				sm="12" md="6">
				<v-card class="custom-img" tile hover @click="showTheme(idx)">
					<v-img
						:src="theme.cover"
						class="white--text align-end"
						gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)"
						height="25rem">
						<v-card-title v-text="theme.name.replace('git-story-template-', '')" class="text-uppercase"></v-card-title>
					</v-img>
				</v-card>
			</v-col>
		</v-row>
		<Confirm/>
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
</style>
<script>
import axios from 'axios';
import Confirm from '../Util/Confirm';
import { findChildByTagName, getGitData, getGitJsonData, commitGitData, commitGitDataQueue, getAllGSThemes, deleteGitFileQueue  } from '../../modules/common.js';
import Lang from '../../languages/Lang.js';

const removeTheme = function(_this = this, list = [], callback) {
	list.forEach((l) => {
		// file
		getGitData(_this, axios, l).then(res => {
			deleteGitFileQueue(_this, axios, res.path, res.sha, callback);
		}).catch(() => {
			deleteGitFileQueue(_this, axios, 'null', 'null', callback);
		});
	});
}

const changeTheme = function() {
	let sTheme = this.sTheme;

	let confirm = findChildByTagName(this, 'Confirm');
	confirm.title = Lang('warning');
	confirm.content = Lang('myblog.template.change_theme');
	confirm.ok = Lang('ok');
	confirm.cancel = Lang('cancel');
	confirm.okClick = () => {
		getGitJsonData(this, axios, '/config.json').then(rconfig => {
			let vueConfig = this.$store.getters.config;
			let config = rconfig.json;

			let apiUrl = vueConfig.api;
			let reqUrl = `${apiUrl}/repos/${sTheme.full_name}/contents`;
			const GET_OTHER_URL = true;

			// remove now theme dependency files
			removeTheme(this, config.theme.files, () => {
				// get target config json 
				getGitJsonData(this, axios, reqUrl+'/config.json', GET_OTHER_URL).then(res => {
					let targetConfig = res.json;
					let theme = targetConfig.theme;
					// theme config update
					config.theme = targetConfig.theme;

					// config json commit
					commitGitData(this, axios, '/config.json', config, rconfig.sha).then(() => {
						theme.files.forEach(tf => {
							let slash = "/";
							if ( tf[0] === "/" ) {
								slash = "";
							}
							// get target file
							getGitData(this, axios, reqUrl + slash + tf, GET_OTHER_URL).then((targetFile) => {
								// get my blog file
								getGitData(this, axios, tf).then(oriFile => {
									// if have file in my blog then update
									commitGitDataQueue(this, axios, targetFile.encoding, targetFile.path, targetFile.content, oriFile.sha);
								}).catch(() => {
									commitGitDataQueue(this, axios, targetFile.encoding, targetFile.path, targetFile.content);
								});
							});
						})
					});
				});
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
		Confirm
	},
	created: function() {
		getGitJsonData(this, axios, 'config.json').then(res => {
			let config = res.json;
			this.config = config;
			this.config_ori = res;
		});

		getAllGSThemes(this, axios).then(themes => {
			this.themes = themes;
			themes.forEach((t) => {
				let apiUrl = this.$store.getters.config.api;
				let reqUrl = `${apiUrl}/repos/${t.full_name}/contents/photos/`;
				getGitData(this, axios, reqUrl, true).then(res => {
					if ( res.length <= 0 ) {
						let avatar = t.owner.avatar_url;
						t.imgs = [ avatar ];
						t.cover = avatar;
					} else {
						t.imgs = res;
						t.cover = res[0].html_url + "?raw=true";
					}
				}).catch(() => {
					let avatar = t.owner.avatar_url;
					t.imgs = [ { html_url: avatar } ];
					t.cover = avatar;
				}).finally(() => {
					this.$forceUpdate();
				});
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
