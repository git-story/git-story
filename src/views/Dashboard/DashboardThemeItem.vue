<!--
 * DashboardThemeItem.vue
 * Created on Fri May 28 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-card tile flat>
		<v-hover>
			<template v-slot:default="{ hover }">
				<v-img
					max-width="800"
	 				max-height="500"
	  				aspect-ratio="1.5"
					:src="theme.thumbnail"
					cover
	   				style="cursor: pointer;"
	   				@click="$assign(theme.preview, true)">
					<v-expand-x-transition>
						<v-card
		  					tile flat
		  					v-if="hover"
		 					class="d-flex h-100 mx-auto"
							style="background: rgba(0, 0, 0, 0.5);">
							<v-row justify="center" align="center">
								<v-col cols="12" align="center">
									<v-icon x-large class="grey--text text--lighten-5">mdi-eye-outline</v-icon>
								</v-col>
							</v-row>
						</v-card>
					</v-expand-x-transition>
				</v-img>
			</template>
		</v-hover>

		<v-card-title>
			<v-btn
				text plain
				color="indigo darken-4"
				class="px-0"
				@click="$assign(theme.link, true)">{{ theme.name }}</v-btn>
			<v-spacer></v-spacer>
			<v-btn
				small tile outlined
				:disabled="theme.used"
				color="cyan darken-2"
				@click.stop="useTheme">
				{{ theme.used ? $t('dashboard.theme.used') : $t('dashboard.theme.use') }}
			</v-btn>
		</v-card-title>
		<v-card-text class="pt-0">
			<div style="height: 50px;">{{ theme.description }}</div>
		</v-card-text>
	</v-card>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Theme } from '@/interface/service';

@Component
export default class DashboardThemeItem extends Mixins(GlobalMixins) {

	@Prop(Object) public theme!: Theme;

	public async useTheme() {
		/* empty */
		this.$emit('changeit', this.theme);
	}

}
</script>
