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
 * Confirm 사용법.
 * import Confirm from './Confirm' 으로 컴포넌트를 추가한다.
 * 사용할 템플릿 안에 <Confirm/> 태그를 추가한다.
 * 추가된 Confrim 컴포넌트를 찾아 title, content, 등을 수정하고
 * Confirm.show 함수로 화면을 띄운다.
 */

export default {
	name: 'Confirm',
	methods: {
	},
	data: function () {
		return {
			isShow: false,
			el: null,
			title: '',
			content: '',
			ok: 'ok',
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
