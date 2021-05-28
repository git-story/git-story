<!--
 * DashboardCategory.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<div class="h-100">
		<h1>{{ $t('dashboard.category.title') }}</h1>
		<v-row class="ma-0">
			<v-col cols="8">
				<v-divider class="my-1"></v-divider>
				<tree
					v-if="treeRenderer"
					:data="data"
					:options="treeOptions"
					ref="tree">
					<div slot-scope="{ node }" class="d-flex" style="align-items: center;">
						<v-text-field color="indigo darken-3" class="pt-0 custom" v-model="node.text" @click.stop="() => {}" />
						&nbsp;
						<v-btn
		  					depressed
		  					class="ml-2"
		 					color="green darken-1"
		 					@click.stop="addChildNode(node)"
							icon>
							<v-icon>mdi-plus</v-icon>
						</v-btn>
						<v-btn
		  					depressed
		  					class="ml-2"
		 					color="red darken-3"
		 					@click.stop="remove(node)"
							icon>
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</div>
				</tree>
				<v-btn
					dark depressed
					tile text
					color="green darken-4"
	 				@click="addNew"
					>
					{{ $t('dashboard.category.new') + ' ' + $t('add') }}
				</v-btn>
			</v-col>
			<v-col cols="4">
				<!--
				<v-row class="ma-0">
					<v-col cols="12">
						<v-btn @click="save">save</v-btn>
						<pre>{{ value }}</pre>
					</v-col>
				</v-row>
				-->
				<v-row class="ma-0">
					<v-col cols="12">
						<v-btn
							:disabled="$store.getters.loading || !modified"
							:dark="modified"
							:loading="$store.getters.loading"
							depressed
							tile block
							@click="save"
							color="teal">
							{{ $t('save') }}
						</v-btn>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';

interface DataTree {
	text: string;
	children: DataTree[];
}

@Component({
	components: {
	},
})
export default class DashboardCategory extends Mixins(GlobalMixins) {

	public treeOptions: any = {
		dnd: true,
	};
	public data: DataTree[] = [];
	public originalData: DataTree[] = [];
	public readonly configFile: string = 'categories.json';
	public treeRenderer: boolean = true;

	get value() {
		return JSON.stringify(this.data, null, '\t');
	}

	get tree() {
		return this.$refs.tree as any;
	}

	get modified() {
		// contents deep compaire
		return JSON.stringify(this.data) !== JSON.stringify(this.originalData);
	}

	public treeReload() {
		this.treeRenderer = false;
		this.$nextTick(() => {
			this.treeRenderer = true;
		});
	}

	public async mounted() {
		this.$store.commit('loading', true);
		this.$logger.debug('app', 'DashboardCateogry mounted');
		this.originalData =
			this.data =
			await this.$git.getContent<DataTree[]>(this.configFile, 'json') as DataTree[];
		this.treeReload();
		this.$store.commit('loading', false);
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

	public async save() {
		this.$store.commit('loading', true);
		this.refresh();
		this.originalData = this.data;
		await this.$git.clear();
		await this.$git.update([
			{
				path: this.configFile,
				blob: {
					content: JSON.stringify(this.data, null, '\t'),
					encoding: 'utf-8',
				},
			},
		], `UPDATE: ${this.configFile}`);
		this.$store.commit('loading', false);
	}

	public remove(node: any) {
		this.$confirm({
			type: 'warning',
			title: this.$t('dashboard.category.remove'),
			content: this.$t('dashboard.category.remove-check'),
			textOk: this.$t('yes'),
			textCancel: this.$t('no'),
		}).then((close) => {
			node.remove();
			this.refresh();
			close();
		}).catch((close) => close());
	}

	public addChildNode(node: any) {
		node.append(this.$t('dashboard.category.new'));
		if ( !node.expanded() ) {
			node.expand();
		}
		this.refresh();
	}

	public addNew() {
		this.tree.append({ text: this.$t('dashboard.category.new') });
		this.refresh();
	}

	private refresh() {
		const { tree } = this.tree;
		const model = tree.model;
		this.data = this.tree2data(model);
	}

}
</script>
