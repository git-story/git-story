<template>
	<v-dialog
		v-model="isShow"
		persistent
		hide-overlay
		max-width="500px"
		width="70%">
		<v-card>
			<v-card-title class="headline">{{ title }}</v-card-title>
			<v-card-text><pre>{{ content }}</pre></v-card-text>
			<v-card-text>
				<v-progress-linear
					indeterminate
					stream>
				</v-progress-linear>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>
<script>
/**
 * PLoading 사용법.
 * import PLoading from './PLoading' 으로 컴포넌트를 추가한다.
 * 사용할 템플릿 안에 <PLoading/> 태그를 추가한다.
 * 추가된 PLoading 컴포넌트를 찾아 title, content, 등을 수정하고
 * Ploading.show 함수로 화면을 띄운다.
 */

export default {
	name: 'Modal',
	methods: {
	},
	data: function () {
		return {
			isShow: false,
			el: null,
			title: '',
			content: '',
			show: () => {
				this.isShow = true;
			},
			hide: () => {
				this.isShow = false;
			}
		}
	}
}
</script>
