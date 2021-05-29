<!--
 * DashboardThemeItem.vue
 * Created on Fri May 28 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-hover style="cursor: pointer;">
		<template v-slot:default="{ hover }">
			<v-card tile :elevation="hover ? 12 : 1" @click="openTheme">
				<v-img
					:src="theme.thumbnail">
				</v-img>

				<v-card-title>
					<span>{{ theme.name }}</span>
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

				<v-divider class="mx-4"></v-divider>

				<v-card-text style="height: 140px;">
					<v-chip
						v-for="chip in theme.tags"
						:key="theme.name + chip"
						class="mt-1 ml-1">
						{{ chip }}
					</v-chip>
				</v-card-text>
			</v-card>
		</template>
	</v-hover>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Theme } from '@/interface/service';

@Component
export default class DashboardThemeItem extends Mixins(GlobalMixins) {

	@Prop(Object) public theme!: Theme;

	public openTheme() {
		window.open(this.theme.preview || this.theme.link);
	}

	public async useTheme() {
		/* empty */
		this.$emit('changeit', this.theme);
	}

}
</script>
