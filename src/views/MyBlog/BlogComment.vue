<template>
	<v-container>
		<!-- S:Disqus Dialog -->
		<v-dialog
			v-model="disqus.view"
			persistent
			max-width="700px"
			width="90%">
			<v-card>
				<v-card-title class="headline">{{ 'Disqus ' + $t('comment') + ' ' + $t('add') }}</v-card-title>
				<v-stepper v-model="disqus.step">
					<v-stepper-header>
						<v-stepper-step :complete="disqus.step > 1" step="1">{{ $t('myblog.comment.get-disqus') }}</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step step="2">{{ $t('myblog.comment.code-disqus') }}</v-stepper-step>
					</v-stepper-header>

					<v-stepper-items>
						<v-stepper-content step="1" align="right">
							<v-card
								class="mb-12"
								height="220px"
								align="center"
								outlined
								tile
								>
								<v-card-text>
									<a href="https://disqus.com/profile/signup/intent/" target="_blank">Go Disqus</a>
								</v-card-text>
							</v-card>

							<v-btn text class="mr-2" @click="disqus.view = false">Cancel</v-btn>
							<v-btn
								color="primary"
								@click="disqus.step = 2"
								>
								Continue
							</v-btn>
						</v-stepper-content>

						<v-stepper-content step="2">
							<v-card
								class="mb-12"
								align="center"
								height="220px"
								outlined
								tile
								>
								<v-card-text>
									<v-textarea 
										id="disqus-code"
										label="Disqus Code"
										no-resize
										height="150px"
										v-model="disqus.code"
										value=""
										:hint="$t('myblog.comment.paste-code')">
									</v-textarea>
								</v-card-text>
							</v-card>

							<v-row class="pa-0">
								<v-col align="left" cols="2" class="py-0">
									<v-btn text @click="disqus.step = 1">Previus</v-btn>
								</v-col>
								<v-col align="right" class="py-0">
									<v-btn text class="mr-2" @click="disqus.view = false">Cancel</v-btn>
									<v-btn
										color="primary"
										@click="clickDisqus"
										>
										Complete
									</v-btn>
								</v-col>
							</v-row>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-card>
		</v-dialog>
		<!-- E:Disqus Dialog -->
		<!-- S:Utterances Dialog -->
		<v-dialog
			v-model="utterances.view"
			persistent
			max-width="700px"
			width="90%">
			<v-card>
				<v-card-title class="headline">{{ 'Utterances ' + $t('comment') + ' ' + $t('add') }}</v-card-title>
				<v-stepper v-model="utterances.step">
					<v-stepper-header>
						<v-stepper-step :complete="utterances.step > 1" step="1">{{ $t('myblog.comment.get-utterances') }}</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step step="2">{{ $t('myblog.comment.code-utterances') }}</v-stepper-step>
					</v-stepper-header>

					<v-stepper-items>
						<v-stepper-content step="1" align="right">
							<v-card
								class="mb-12"
								height="220px"
								align="center"
								outlined
								tile
								>
								<v-card-text>
									<a href="https://utteranc.es/" target="_blank">Go Utterances</a>
								</v-card-text>
							</v-card>

							<v-btn text class="mr-2" @click="utterances.view = false">Cancel</v-btn>
							<v-btn
								color="primary"
								@click="utterances.step = 2"
								>
								Continue
							</v-btn>
						</v-stepper-content>

						<v-stepper-content step="2">
							<v-card
								class="mb-12"
								align="center"
								height="220px"
								outlined
								tile
								>
								<v-card-text>
									<v-textarea 
										id="utterances-code"
										label="Utterances Code"
										no-resize
										height="150px"
										v-model="utterances.code"
										value=""
										:hint="$t('myblog.comment.paste-code')">
									</v-textarea>
								</v-card-text>
							</v-card>

							<v-row class="pa-0">
								<v-col align="left" cols="2" class="py-0">
									<v-btn text @click="utterances.step = 1">Previus</v-btn>
								</v-col>
								<v-col align="right" class="py-0">
									<v-btn text class="mr-2" @click="utterances.view = false">Cancel</v-btn>
									<v-btn
										color="primary"
										@click="clickUtterances"
										>
										Complete
									</v-btn>
								</v-col>
							</v-row>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-card>
		</v-dialog>
		<!-- E:Utterances Dialog -->
		<!-- S:Facebook Dialog -->
		<!-- 
		<v-dialog
			v-model="facebook.view"
			persistent
			max-width="700px"
			width="90%">
			<v-card>
				<v-card-title class="headline">{{ 'Facebook ' + $t('comment') + ' ' + $t('add') }}</v-card-title>
				<v-stepper v-model="facebook.step">
					<v-stepper-header>
						<v-stepper-step :complete="facebook.step > 1" step="1">{{ $t('myblog.comment.get-facebook') }}</v-stepper-step>

						<v-divider></v-divider>

						<v-stepper-step step="2">{{ $t('myblog.comment.code-facebook') }}</v-stepper-step>
					</v-stepper-header>

					<v-stepper-items>
						<v-stepper-content step="1" align="right">
							<v-card
								class="mb-12"
								height="220px"
								align="center"
								outlined
								tile
								>
								<v-card-text>
									<a href="https://developers.facebook.com/docs/plugins/comments/?translation" target="_blank">Go Facebook</a>
								</v-card-text>
							</v-card>

							<v-btn text class="mr-2" @click="facebook.view = false">Cancel</v-btn>
							<v-btn
								color="primary"
								@click="facebook.step = 2"
								>
								Continue
							</v-btn>
						</v-stepper-content>

						<v-stepper-content step="2">
							<v-card
								class="mb-12"
								align="center"
								height="220px"
								outlined
								tile
								>
								<v-card-text>
									<v-textarea 
										id="facebook-code"
										label="Facebook Code"
										no-resize
										height="150px"
										v-model="facebook.code"
										value=""
										:hint="$t('myblog.comment.paste-code')">
									</v-textarea>
								</v-card-text>
							</v-card>

							<v-row class="pa-0">
								<v-col align="left" cols="2" class="py-0">
									<v-btn text @click="facebook.step = 1">Previus</v-btn>
								</v-col>
								<v-col align="right" class="py-0">
									<v-btn text class="mr-2" @click="facebook.view = false">Cancel</v-btn>
									<v-btn
										color="primary"
										@click="clickFacebook"
										>
										Complete
									</v-btn>
								</v-col>
							</v-row>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-card>
		</v-dialog>
		-->
		<!-- E:Facebook Dialog -->
		<v-row>
			<v-col cols="12" md="10" lg="8" class="pa-0">
				<v-toolbar color="transparent white--text" flat>
					<v-toolbar-title>Comment Setting</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn color="success" tile @click="commentApply">{{ $t('apply') }}</v-btn>
					<template v-slot:extension>
						<v-tabs
							v-model="tab"
							background-color="transparent"
							color="white"
							class="elevation-2 mt-5"
							centerd
							grow>
							<v-tabs-slider></v-tabs-slider>
							<v-tab href="#other-api"> {{ $t('myblog.comment.other-api') }} </v-tab>


						</v-tabs>
					</template>
				</v-toolbar>
				<v-tabs-items v-model="tab" class="mt-12" style="background-color:transparent">
					<v-tab-item value="other-api" color="transparent">
						<v-card flat tile color="transparent" dark>
							<v-card-text>
								<!-- S:Disqus List Item -->
								<v-row align="center" class="ma-0">
									<v-col>
										<v-list-item @click="clickDisqus" color="transparent">
											<v-list-item-icon>
												<v-icon>mdi-disqus</v-icon>
											</v-list-item-icon>
											<v-list-item-content>
												<v-list-item-title>Disqus</v-list-item-title>
											</v-list-item-content>
											<v-list-item-avatar class="ma-0" v-if="disqus.has">
												<v-icon color="success">mdi-check-circle</v-icon>
											</v-list-item-avatar>
											<v-list-item-avatar class="ma-0" v-else>
												<v-icon>mdi-plus-circle</v-icon>
											</v-list-item-avatar>
										</v-list-item>
									</v-col>
								</v-row>
								<!-- E:Disqus List Item -->
								<!-- S:Utterances List Item -->
								<v-row align="center" class="ma-0">
									<v-col>
										<v-list-item @click="clickUtterances">
											<v-list-item-icon>
												<v-icon>mdi-github-circle</v-icon>
											</v-list-item-icon>
											<v-list-item-content>
												<v-list-item-title>Utterances</v-list-item-title>
											</v-list-item-content>
											<v-list-item-avatar class="ma-0" v-if="utterances.has">
												<v-icon color="success">mdi-check-circle</v-icon>
											</v-list-item-avatar>
											<v-list-item-avatar class="ma-0" v-else>
												<v-icon>mdi-plus-circle</v-icon>
											</v-list-item-avatar>
										</v-list-item>
									</v-col>
								</v-row>
								<!-- E:Utterances List Item -->
								<!-- S:Facebook List Item -->
								<!--
								<v-row align="center" class="ma-0">
									<v-col>
										<v-list-item @click="clickFacebook">
											<v-list-item-icon>
												<v-icon>mdi-facebook</v-icon>
											</v-list-item-icon>
											<v-list-item-content>
												<v-list-item-title>Facebook</v-list-item-title>
											</v-list-item-content>
											<v-list-item-avatar class="ma-0" v-if="facebook.has">
												<v-icon color="success">mdi-check-circle</v-icon>
											</v-list-item-avatar>
											<v-list-item-avatar class="ma-0" v-else>
												<v-icon>mdi-plus-circle</v-icon>
											</v-list-item-avatar>
										</v-list-item>
									</v-col>
								</v-row>
								-->
								<!-- E:Facebook List Item -->
							</v-card-text>
						</v-card>
					</v-tab-item>
				</v-tabs-items>
			</v-col>
		</v-row>
		<Confirm ref="Confirm"/>
		<PLoading ref="PLoading"/>
		<Modal ref="Modal"/>
	</v-container>
</template>
<script>
import { findChildByTagName } from '../../modules/common.js';
import Confirm from '../Util/Confirm';
import PLoading from '../Util/PLoading';
import EventBus from '../../modules/event-bus.js';
import Modal from '../Util/Modal';

const commentApply = function() {
	let task = this.$store.getters.task;
	if ( task === true ) {
		let modal = findChildByTagName(this, "Modal");
		modal.title = this.$t('notification');
		modal.content = this.$t('inprogress');
		modal.ok = this.$t('confirm');
		modal.show();
		return;
	}

	this.$store.commit('task', true);

	let commitMsg = `📚 [GITSTORY] 📜 Comment UPDATE : [config.json]`;

	let ploading = findChildByTagName(this, "PLoading");
	ploading.content = this.$t('applying');
	ploading.show();
	
	let comment = this.comment;
	let config = this.config;
	config.comment = comment;

	let gitApi = this.$store.getters.api;

	gitApi.repo.commitFiles(commitMsg, [{
		"path": "config.json",
		"content": config
	}]).then(() => {
		ploading.hide();
	}).catch(() => {
		ploading.hide();
	}).finally(() => {
		this.$store.commit('task', false);
	});
}

const clickFacebook = function() {
	let facebook = this.facebook;
	facebook.step = 1;
	if ( facebook.view === true ) {
		// close dialog
		facebook.view = false;
		facebook.has = true;

		let comment = this.comment;
		comment.facebook = facebook.code;
	} else {
		if ( facebook.has === true ) {
			let confirm = findChildByTagName(this, 'Confirm');
			confirm.title = this.$t('warning');
			confirm.content = this.$t('myblog.comment.confirm-delete');
			confirm.ok = this.$t('ok');
			confirm.cancel = this.$t('cancel');
			confirm.okClick = () => {
				if ( this.comment.facebook ) {
					delete this.comment.facebook;
				}
				facebook.has = false;
				facebook.code = '';
				confirm.hide();
			};
			confirm.show();
		} else {
			facebook.view = true;
		}
	}
}

// TODO: 2020. 02. 11
// utternaces 는 스크립트 태그 형태가 아니라 객체를 사용해야 함.
// tree-some.gitgub.io 참고
const clickUtterances = function() {
	let utterances = this.utterances;
	utterances.step = 1;
	if ( utterances.view === true ) {
		// close dialog
		utterances.view = false;
		utterances.has = true;

		let comment = this.comment;
		comment.utterances = utterances.code;
	} else {
		if ( utterances.has === true ) {
			let confirm = findChildByTagName(this, 'Confirm');
			confirm.title = this.$t('warning');
			confirm.content = this.$t('myblog.comment.confirm-delete');
			confirm.ok = this.$t('ok');
			confirm.cancel = this.$t('cancel');
			confirm.okClick = () => {
				if ( this.comment.utterances ) {
					delete this.comment.utterances;
				}
				utterances.has = false;
				utterances.code = '';
				confirm.hide();
			};
			confirm.show();
		} else {
			utterances.view = true;
		}
	}
}

const clickDisqus = function() {
	let disqus = this.disqus;
	disqus.step = 1;
	if ( disqus.view === true ) {
		// close dialog
		disqus.view = false;
		disqus.has = true;

		let comment = this.comment;
		comment.disqus = disqus.code;
	} else {
		if ( disqus.has === true ) {
			let confirm = findChildByTagName(this, 'Confirm');
			confirm.title = this.$t('warning');
			confirm.content = this.$t('myblog.comment.confirm-delete');
			confirm.ok = this.$t('ok');
			confirm.cancel = this.$t('cancel');
			confirm.okClick = () => {
				if ( this.comment.disqus ) {
					delete this.comment.disqus;
				}
				disqus.has = false;
				disqus.code = '';
				confirm.hide();
			};
			confirm.show();
		} else {
			disqus.view = true;
		}
	}
}

export default {
	name: 'BlogComment',
	components: {
		Confirm,
		PLoading,
		Modal,
	},
	created: function() {
		let gitApi = this.$store.getters.api;
		gitApi.repo.getJsonData("config.json").then(res => {
			this.config = res.json;
			this.config_ori = res;

			if ( !this.config.comment ) {
				this.config.comment = {};
			}
			this.comment = this.config.comment;

			if ( this.comment ) {
				if ( this.comment.disqus ) {
					this.disqus.has = true;
				}
				if ( this.comment.utterances ) {
					this.utterances.has = true;
				}
				if ( this.comment.facebook ) {
					this.facebook.has = true;
				}
			}
			EventBus.$emit('page-loading-end');
		});
	},
	methods: {
		clickDisqus,
		clickUtterances,
		clickFacebook,
		commentApply
	},
	mounted: function() {
	},
	data: function() {
		return {
			tab: 'other-api',
			disqus: {
				view: false,
				step: 0,
				code: '',
				has: false,
			},
			utterances: {
				view: false,
				step: 0,
				code: '',
				has: false,
			},
			facebook: {
				view: false,
				step: 0,
				code: '',
				has: false,
			},
		}
	},
};
</script>
