<template>
	<v-navigation-drawer
		v-model="vMobile"
		style="padding-top: 64px"
		fixed
		temporary>
		<v-list-item>
			<v-list-item-content>
				<v-list-item-title class="headline">{{ Lang('myblog.side.content') }}</v-list-item-title>
			</v-list-item-content>
		</v-list-item>

		<v-list dense>
			<v-list-item link @click="contentChange('BlogList')">
				<v-list-item-icon>
					<v-icon>mdi-playlist-edit</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title class="body-1">
						{{ Lang('myblog.side.manage_post') }}
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item link @click="contentChange('BlogCategory')">
				<v-list-item-icon>
					<v-icon>mdi-shape</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title class="body-1">
						{{ Lang('myblog.side.manage_category') }}
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>

		<v-divider></v-divider>

	</v-navigation-drawer>
</template>
<script>
import Lang from '../../languages/Lang.js';
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
		Lang,
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
