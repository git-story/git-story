<!--
 * SettingLink.vue
 * Created on Tue Jun 15 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-hover v-slot="{ hover }">
		<v-list-item
			:key="keyname"
			class="white"
			@click="$assign(path); $emit('input', true);">
			<template v-slot:default="{ active }">
				<v-list-item-avatar
					class="mr-5 pa-5"
					:class="hover || active ? ' indigo lighten-5' : 'grey lighten-4'" >
					<v-icon>{{ icon }}</v-icon>
				</v-list-item-avatar>
				<v-list-item-content>

					<v-list-item-title
						class="font-weight-bold"
						:class="hover || active ? 'black--text' : 'grey--text text--lighten-1'">
						{{ title }}
					</v-list-item-title>

					<v-list-item-subtitle
		 				class="mt-2"
						:class="hover || active ? 'black--text' : 'grey--text text--lighten-1'">
						<slot></slot>
					</v-list-item-subtitle>
				</v-list-item-content>

				<v-list-item-action>
					<v-icon
						:color="hover || active ? 'black' : 'grey lighten-1'">
						mdi-arrow-right
					</v-icon>
				</v-list-item-action>
			</template>
		</v-list-item>
	</v-hover>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

@Component({
	components: {
	},
})
export default class SettingLink extends Mixins(GlobalMixins) {

	@Prop(String) public keyname!: string;
	@Prop(String) public title!: string;
	@Prop(String) public icon!: string;

	get path() {
		return `/dashboard/setting/${this.keyname}`;
	}

}
</script>
