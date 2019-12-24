<template>
	<v-dialog
		v-model="isShow"
		persistent
		max-width="500px"
		width="70%">
		<v-card>
			<v-card-title class="headline">{{ title }}</v-card-title>
			<v-card-text><span v-html="content"></span></v-card-text>
			<v-card-actions>
				<div class="flex-grow-1"></div>

				<v-btn
					color="info darken-1"
					text
					@click="okClick">
					{{ ok }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
/**
 * Modal 사용법.
 * import Modal from './Modal' 으로 컴포넌트를 추가한다.
 * 사용할 템플릿 안에 <Modal/> 태그를 추가한다.
 * 추가된 Modal 컴포넌트를 찾아 title, content, 등을 수정하고
 * Modal.show 함수로 화면을 띄운다.
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
			ok: 'ok',
			okClick: () => { this.hide(); },
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
