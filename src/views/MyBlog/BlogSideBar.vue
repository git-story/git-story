<template>
	<v-navigation-drawer
		v-model="vMobile"
		style="padding-top: 64px"
		fixed
		temporary>
		<v-list-item>
			<v-list-item-content>
				<v-list-item-title class="headline">{{ $t('myblog.side.content') }}</v-list-item-title>
			</v-list-item-content>
		</v-list-item>

		<v-list dense>
			<v-list-item link @click="contentChange('BlogList')">
				<v-list-item-icon>
					<v-icon>mdi-playlist-edit</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title class="body-1">
						{{ $t('myblog.side.manage_post') }}
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item link @click="contentChange('BlogCategory')">
				<v-list-item-icon>
					<v-icon>mdi-shape</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title class="body-1">
						{{ $t('myblog.side.manage_category') }}
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>

		<v-divider></v-divider>

		<v-list-item>
			<v-list-item-content>
				<v-list-item-title class="headline">
					{{ $t('myblog.side.setting_blog') }}
				</v-list-item-title>
			</v-list-item-content>
		</v-list-item>

		<v-list dense>
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
			<!--
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
			-->
			<!-- E:Blog ETC -->
		</v-list>
	</v-navigation-drawer>
</template>
<script>
import { routeAssignUrl  } from '../../modules/common.js';
import EventBus from '../../modules/event-bus.js'

const contentChange = function(content) {
	EventBus.$emit('content-change', content);
	this.vMobile = false;
};

export default {
	name: 'BlogSideBar',
	components: {
	},
	created: function() {
		EventBus.$on('sidebarToggle', () => {
			this.vMobile = !this.vMobile;
		});
	},
	methods: {
		routeAssignUrl,
		contentChange
	},
	mounted: function() {
	},
	data: function() {
		return {
			vMobile: false
		}
	},
};
</script>
