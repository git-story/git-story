<!--
 * DashboardCategory.vue
 * Created on Fri Mar 26 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<div class="h-100">
		<v-row class="ma-0">
			<v-col cols="8">
				<tree
					v-if="treeRenderer"
					:data="data"
					:options="treeOptions"
	 				style="overflow: hidden;"
	 				@node:dragging:finish="refresh"
					ref="tree">
					<v-row slot-scope="{ node }" class="ma-0" align="center">
						<v-text-field
							color="indigo darken-3"
							class="pt-0 custom"
							v-model="node.text"
	   						@input="refresh"
	   						flat hide-details rounded
	   						background-color="transparent"
							@click.stop="() => {}" />
						<v-spacer></v-spacer>
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
					</v-row>
				</tree>
			</v-col>
			<v-col cols="4">
				<v-row class="ma-0">
					<v-col cols="12" class="pb-0">
						<v-btn
							dark depressed
		  					block
							tile text
							color="green darken-4"
							@click="addNew"
	   						large
							>
							{{ $t('dashboard.category.new') + ' ' + $t('add') }}
						</v-btn>
					</v-col>
				</v-row>
				<v-row class="ma-0">
					<v-col cols="12">
						<v-btn
							:disabled="$store.getters.loading || !modified"
							:dark="modified"
							:loading="$store.getters.loading"
							depressed text
							tile block large
							@click="save"
							color="indigo darken-4">
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
import { DataTree } from '@/interface/service';

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

		while ( true ) {
			this.originalData =
				this.data =
				await this.$git.getContent<DataTree[]>(this.configFile, 'json') as DataTree[];
			if ( this.originalData ) {
				break;
			}
			await this.$sleep(1000);
		}
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

	public checkDuplication(data: any[], arr: string[] = []) {
		for ( const item of data ) {
			const i = arr.find((a) => a === item.text);
			if ( i ) {
				return false;
			}
			arr.push(item.text);
			if ( Array.isArray(item.children) && item.children.length > 0 ) {
				const ret = this.checkDuplication(item.children, arr);
				if ( ret === false ) {
					return false;
				}
			}
		}
		return true;
	}

	public async save() {
		this.$store.commit('loading', true);
		this.refresh();

		if ( !this.checkDuplication(this.data) ) {
			this.$noti({
				content: this.$t('dashboard.category.duplicated'),
				horizontal: 'right',
				vertical: 'top',
				type: 'error',
			});
			this.$store.commit('loading', false);
			return;
		}

		this.originalData = this.data;
		await this.$git.clear();
		await this.$git.update(this.configFile, JSON.stringify(this.data, null, '\t'));
		await this.$git.commit(`UPDATE: ${this.configFile}`);
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
