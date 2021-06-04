<!--
 * DashboardSetting.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<div>
		<h1>Hello Setting</h1>
	</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import firebase from 'firebase';

@Component({
	components: {
	},
})
export default class DashboardSetting extends Mixins(GlobalMixins) {

	public async mounted() {
		this.$logger.debug('app', 'DashboardSetting mounted');
		let user: any;

		do {
			user = firebase.auth().currentUser;
			await this.$sleep(500);
		} while ( !user );

		const userInfo = user.toJSON();

		window.open('https://api.imgur.com/oauth2/authorize?client_id=f70a15b9bcfe4cc&response_type=token&state='+userInfo.uid, '_blank');
	}

}
</script>
