<!--
 * DashboardSetting.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-row class="h-100 ma-0">
		<!-- S: Left Panel -->
		<v-col cols="6" class="pa-0">
			<!-- S: Contribution -->
			<v-row class="ma-0">
				<v-col cols="12">
					<contribution />
				</v-col>
			</v-row>
			<!-- E: Contribution -->
			<v-list two-line>
				<v-list-item-group
					v-model="selected"
  					active-class="pink--text"
  					multiple>
					<v-list-item key="test">
						<template v-slot:default="{ active }">
							<v-list-item-content>
								<v-list-item-title>title</v-list-item-title>

								<v-list-item-subtitle
									class="text--primary">
									headline
								</v-list-item-subtitle>

								<v-list-item-subtitle>
									subtitle
								</v-list-item-subtitle>
			  				</v-list-item-content>

			  				<v-list-item-action>
								<v-icon
									color="yellow darken-3">
									mdi-star
				  				</v-icon>
			  				</v-list-item-action>
		  				</template>
	  				</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-col>
		<!-- E: Left Panel -->
		<!-- S: Right Panel -->
		<v-col cols="6" class="pa-0">
			<router-view></router-view>
		</v-col>
		<!-- E: Right Panel -->
	</v-row>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import Contribution from './DashboardSettingContribution.vue';

@Component({
	components: {
		Contribution,
	},
})
export default class DashboardSetting extends Mixins(GlobalMixins) {

	public config: any = {};
	public selected: string = 'test';

	public async mounted() {
		this.$logger.debug('app', 'DashboardSetting mounted');
		this.config = await this.$getConfig();
	}

}
</script>
