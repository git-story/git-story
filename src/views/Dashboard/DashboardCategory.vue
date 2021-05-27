<!--
 * DashboardCategory.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<div>
		<h1>Hello Category</h1>
		<v-row class="ma-0 h-100">
			<v-col cols="8">
				<tree
					:data="data"
					:options="treeOptions"
					ref="tree">
					<span slot-scope="{ node }">
						<v-text-field class="pt-0 custom" v-model="node.text" @click.stop="() => {}"/>
					</span>
				</tree>
			</v-col>
			<v-col cols="4">
				<v-btn @click="save">save</v-btn>
				<pre>{{ value }}</pre>
			</v-col>
		</v-row>
	</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

@Component({
	components: {
	},
})
export default class DashboardCategory extends Mixins(GlobalMixins) {

	public treeOptions: any = {
		dnd: true,
	};
	public data: any[] = [
		{
			text: 'MyText',
			children: [
				{ text: 'Children', },
			],
		},
		{
			text: 'asdfasdf',
		},
	];

	get value() {
		return JSON.stringify(this.data, null, '\t');
	}

	public mounted() {
		this.$logger.debug('app', 'DashboardCateogry mounted');
	}

	public tree2data(tree: any[]) {
		const ret: any[] = [];
		for ( const t of tree ) {
			const obj: any = {
				text: t.data.text,
			};
			if ( Array.isArray(t.children) && t.children.length > 0 ) {
				obj.children = this.tree2data(t.children);
			}
			ret.push(obj);
		}
		return ret;
	}

	public save() {
		const model = this.$refs.tree.tree.model;
		this.data = this.tree2data(model);
	}

}
</script>
