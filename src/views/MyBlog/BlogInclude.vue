<template>
	<v-container>
		<v-row align="center">
			<v-col class="pa-0">
				<v-card width="100%" color="transparent" tile flat>
					<v-toolbar class="tool-custom" flat color="transparent" dark>
						<v-btn color="blue-grey darken-1" @click="createTag" dark class="mr-3" tile>{{ Lang('myblog.include.new_tag') }}</v-btn>
						<v-btn color="success" @click="applyIncludeTags" dark tile>{{ Lang('apply') }}</v-btn>
					</v-toolbar>
					<v-tabs
						dark
						background-color="transparent"
						class="tool-custom"
						v-model="currentTab"
						vertical>
						<!-- S:!Tab Icon -->
						<v-tab href="#header" style="width: 140px;">
							<v-icon left>mdi-format-header-increase</v-icon>
							Header
						</v-tab>
						<v-tab href="#body-start" style="width: 140px">
							<v-icon left>mdi-format-letter-starts-with</v-icon>
							Body Start
						</v-tab>
						<v-tab href="#body-end" style="width: 140px">
							<v-icon left>mdi-format-letter-ends-with</v-icon>
							Body End
						</v-tab>
						<!-- E:!Tab Icon -->

						<v-tabs-items v-model="currentTab" style="background-color:transparent">
							<!-- S: Tab Item -->
							<v-tab-item :key="item.id" v-for="(item) in tabItems" :value="item.id">
								<v-card flat color="transparent">
									<v-card-text>
										<v-list flat color="transparent">
											<!-- S: Tag Items -->
											<template v-for="(tag, idx) in item.list">
												<v-list-item-group :key="idx" v-model="selectTag">
													<v-list-item dark color="white">
														<v-list-item-content>
															<v-list-item-title>
																<span class="font-weight-light">{{ tag }}</span>
															</v-list-item-title>
														</v-list-item-content>
														<v-list-item-action>
															<v-tooltip top>
																<template v-slot:activator="{ on }">
																	<v-btn icon v-on="on" @click.stop="modifyTag(tag, item.id, idx)">
																		<v-icon>mdi-pencil</v-icon> 
																	</v-btn>
																</template>
																<span>{{ Lang('modify') }}</span>
															</v-tooltip>
														</v-list-item-action>
														<v-list-item-action>
															<v-tooltip top>
																<template v-slot:activator="{ on }">
																	<v-btn icon v-on="on" @click.stop="deleteTag(tag, item.id, idx)">
																		<v-icon>mdi-trash-can</v-icon> 
																	</v-btn>
																</template>
																<span>{{ Lang('delete') }}</span>
															</v-tooltip>
														</v-list-item-action>
													</v-list-item>
												</v-list-item-group>
											</template>
											<!-- E: Tag Items -->
										</v-list>
									</v-card-text>
								</v-card>
							</v-tab-item>
							<!-- S: Tab Item -->
						</v-tabs-items>
					</v-tabs>
				</v-card>
			</v-col>
			<v-col cols="4" class="d-none d-lg-flex"></v-col>
		</v-row>
		<Confirm/>
		<IModal/>
		<Modal/>
		<PLoading/>
	</v-container>
</template>
<style>
header.tool-custom {
	margin-bottom: 1rem;
}
</style>
<script>
import { findChildByTagName  } from '../../modules/common.js';
import Lang from '../../languages/Lang.js';
import Confirm from '../Util/Confirm';
import IModal from '../Util/IModal';
import Modal from '../Util/Modal';
import PLoading from '../Util/PLoading';

const updateIncludeItems = function(_this = this) {
	let config = _this.config;
	let header = config.head;
	let bodyS = config.body.start;
	let bodyE = config.body.end;

	_this.tabItems = [
		{ id: 'header', list: header },
		{ id: 'body-start', list: bodyS },
		{ id: 'body-end', list: bodyE }
	];
};

const getTagArrayById = (config, id) => {
	let tagArray = new Array();
	if ( id === "header" ) {
		tagArray = config.head;
	} else if ( id === "body-start" ) {
		tagArray = config.body.start;
	} else if ( id === "body-end" ) {
		tagArray = config.body.end;
	}
	return tagArray;
};

const createTag = function() {
	let id = this.currentTab;

	let imodal = findChildByTagName(this, "IModal");
	imodal.title = Lang('myblog.include.new_tag');
	imodal.inputText = '';
	imodal.ok = Lang('add');
	imodal.cancel = Lang('cancel');
	imodal.okClick = () => {
		let text = imodal.inputText;
		let tagArray = getTagArrayById(this.config, id);
		tagArray.push(text);
		updateIncludeItems(this);

		imodal.hide();
	}
	imodal.show();
};

const modifyTag = function(tag, id, idx) {
	let imodal = findChildByTagName(this, "IModal");
	imodal.title = Lang('myblog.include.modify_tag');
	imodal.inputText = tag;
	imodal.ok = Lang('modify');
	imodal.cancel = Lang('cancel');
	imodal.okClick = () => {
		let text = imodal.inputText;
		
		let tagArray = getTagArrayById(this.config, id);
		tagArray[idx] = text;
		updateIncludeItems(this);
		imodal.hide();
	}
	imodal.show();
};

const deleteTag = function(tag, id, idx) {
	let confirm = findChildByTagName(this, "Confirm");
	confirm.title = Lang('warning');
	confirm.content = Lang('myblog.include.delete_tag');
	confirm.ok = Lang('ok');
	confirm.cancel = Lang('no');
	confirm.okClick = () => {
		let tagArray = getTagArrayById(this.config, id);
		tagArray.splice(idx, 1);
		confirm.hide();
	};
	confirm.show();
};

const applyIncludeTags = function() {
	let config = this.config;

	let ploading = findChildByTagName(this, "PLoading");
	ploading.content = Lang('applying');
	ploading.show();

	let gitApi = this.$store.getters.api;
	gitApi.repo.commitFiles("Include Tag Apply", [{
		"path": "config.json",
		"content": config
	}]).then(() => {
		let modal = findChildByTagName(this, "Modal");
		modal.title = Lang('notification');
		modal.content = Lang('myblog.include.success_apply');
		modal.ok = Lang('ok');
		modal.show();
	}).finally(() => {
		ploading.hide();
	});
};

export default {
	name: 'BlogInclude',
	components: {
		Confirm,
		IModal,
		Modal,
		PLoading
	},
	created: function() {
		let gitApi = this.$store.getters.api;
		gitApi.repo.getJsonData("config.json").then(res => {
			let config = res.json

			this.config = config;
			this.config_ori = res;

			updateIncludeItems(this);
		});
	},
	methods: {
		Lang,
		modifyTag,
		applyFunc: () => {},
		deleteTag,
		createTag,
		applyIncludeTags
	},
	mounted: function() {
	},
	data: function() {
		return {
			currentTab: 'header',
			tabItems: [],
			selectTag: 1,
		}
	},
};
</script>
