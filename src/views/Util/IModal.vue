<template>
	<v-dialog 
		v-model="isShow"
		persistent
		max-width="600px"
		width="80%">
		<v-card color="white">
			<v-card-title class="pb-0">{{ title }}</v-card-title>
			<v-card-text class="pb-0 pt-0">
				<v-text-field class="mb-0 pb-0" v-model="inputText"></v-text-field>
			</v-card-text>

			<v-card-actions>
				<div class="flex-grow-1"></div>

				<v-btn
					color="red darken-1"
					text
					@click="cancelClick">
					{{ cancel }}
				</v-btn>

				<v-btn
					color="green darken-1"
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
 * IModal 사용법.
 * import IModal from './IModal' 으로 컴포넌트를 추가한다.
 * 사용할 템플릿 안에 <IModal/> 태그를 추가한다.
 * 추가된 IModal 컴포넌트를 찾아 title, content, 등을 수정하고
 * IModal.show 함수로 화면을 띄운다.
 */

export default {
	name: 'IModal',
	methods: {
	},
	data: function () {
		return {
			isShow: false,
			el: null,
			title: '',
			content: '',
			ok: 'ok',
			inputText: '',
			cancel: 'cancel',
			okClick: () => { this.hide(); },
			cancelClick: () => { this.hide(); },
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
