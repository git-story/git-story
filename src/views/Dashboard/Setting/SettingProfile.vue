<!--
 * SettingProfile.vue
 * Created on Tue Jun 15 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-container class="pa-4">
		<v-row class="ma-0">
			<v-col cols="12" class="pt-0">
				<h2>{{ $t('dashboard.setting.menu.profile') }}</h2>
			</v-col>
		</v-row>
		<v-divider class="my-6"></v-divider>

		<v-row class="ma-0">
			<v-col cols="12">
				<h3>{{ $t('dashboard.setting.profile.remove-blog') }}</h3>
				<p
					class="mt-3" style="font-size: 11pt;"
					v-html="$t('dashboard.setting.profile.remove-blog-desc')"></p>
			</v-col>
		</v-row>

		<v-row class="ma-0">
			<v-col cols="12">
				<h3>{{ $t('dashboard.setting.profile.unsubscribe') }}</h3>
				<p
					class="mt-3" style="font-size: 11pt;"
					v-html="$t('dashboard.setting.profile.unsubscribe-desc')"></p>
			</v-col>
		</v-row>
	</v-container>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

@Component({
	components: {
	},
})
export default class SettingProfile extends Mixins(GlobalMixins) {

	public async mounted() {
	}

}
</script>
