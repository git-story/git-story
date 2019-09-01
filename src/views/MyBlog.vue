<template>
	<v-content style="overflow:hidden">
		<iframe 
			src=""
			frameBorder="0" 
			crossorigin="anonymous" 
			style="width:100% ; border:0; height:100%;"></iframe>

		<Confirm/>
		<Modal/>
	</v-content>
</template>
<script>
import axios from 'axios';
import Confirm from './Confirm';
import Modal from './Modal';
import { randomNumber, findChildByTagName, routeAssignUrl  } from '../modules/common.js';

// 레포지토리 삭제. "유저/레포지토리" 형식으로 매개변수를 받음 그리고 store 정보를 받음
const removeRepository = function(repoFullPath, store) {
	return new Promise((resolve, reject) => {
		if ( repoFullPath && store ) {
			axios({
				url: `${store.getters.config.api}/repos/${repoFullPath}`,
				method: 'delete',
				headers: {
					'Authorization': `Token ${store.getters.token}`
				}
			}).then(res => {
				if ( res.status === 204 ) {
					resolve();
				} else {
					reject();
				}
			}).catch(err => {
				reject(err);
			});
		} else {
			reject();
		}
	});
};

const createRepository = function(_this = this) {
	if ( !_this ) return;

	let store = _this.$store;
	let user = store.getters.user;
	let modal = findChildByTagName(_this, "Modal");

	let templates = store.getters.config.templates;
	let template = templates[randomNumber(templates.length)];
	axios({
		url: `https://api.github.com/repos/mobbing/${template}/generate`,
		method: 'post',
		headers: {
			'Authorization': `Token ${store.getters.token}`,
			'Accept': 'application/vnd.github.baptiste-preview+json'
		},
		data: {
			'owner':  user.name,
			'name': `${user.name}.github.io`,
			'description': 'my github blog',
			'private': false
		}
	}).then(() => {
		modal.title = "알림";
		modal.content = "블로그 생성에 성공하였습니다!";
		modal.ok = "확인";
		modal.okClick = () => {
			modal.hide();
			_this.$router.go(_this.$router.path);
		};
		modal.show();
	}).catch(() => {
		modal.title = "에러";
		modal.content = "블로그 생성에 실패하였습니다.";
		modal.ok = "확인";
		modal.okClick = () => {
			modal.hide();
			routeAssignUrl('/');
		};
		modal.show();
	});
};

export default {
	name: 'MyBlog',
	components: {
		Confirm,
		Modal
	},
	methods: {
	},
	mounted: function() {
		let iframe = document.querySelector('iframe');
		axios({
			url: `${this.$store.getters.config.api}/users/${this.$store.getters.user.name}/repos`,
			method: 'get',
			headers: {
				'Accept': 'application/vnd.github.baptiste-preview+json',
				'Authorization': `Token ${this.$store.getters.token}`
			}
		}).then(res => {
			let confirm = findChildByTagName(this, "Confirm");
			let modal = findChildByTagName(this, "Modal");
			let repos = res.data;
			let ridx = repos.findIndex(r => r.name === `${this.$store.getters.user.name}.github.io`);
			if ( ridx >= 0 ) {
				// 블로그 레포지토리가 있을 때
				// Git Page 가 있는지 확인한다.
				let repo = repos[ridx];
				if ( repo.has_pages ) {
					// Git Page 있음
					let url = `https://${this.$store.getters.user.name}.github.io`;
					iframe.src = url;
				} else {
					// Git page 없음
					confirm.title = "알림"
					confirm.content = '블로그 레포지토리는 존재하나, 활성화 된 페이지가 없습니다.<br><br>'+
						'레포지토리 삭제 후 다시 생성하시겠습니까? <br>'+
						'취소하시면 메인 화면으로 돌아갑니다.'
					confirm.ok = "예";
					confirm.cancel = "아니오";
					confirm.okClick = () => {
						// 레포지토리 삭제 후 생성
						removeRepository(repo.full_name, this.$store).then(() => {
							createRepository(this);
						}).catch(() => {
							modal.title = "에러";
							modal.content = "레포지토리를 삭제할 수 없습니다.";
							modal.ok = "확인";
							modal.okClick = () => {
								modal.hide();
								routeAssignUrl('/');
							};
							modal.show();
						});
						confirm.hide();
					}
					confirm.cancelClick = () => {
						routeAssignUrl('/', this);
						confirm.hide();
					}
					confirm.show();
				}
			} else {
				// 블로그 레포지토리가 없을 때
				confirm.title = "알림"
				confirm.content = '블로그 레포지토리가 존재하지 않습니다.\r\n'+
					'레포지토리 생성하시겠습니까?\r\n\r\n'+
					'취소하시면 메인 화면으로 돌아갑니다.'
				confirm.ok = "예";
				confirm.cancel = "아니오";
				confirm.okClick = () => {
					// 레포지토리 생성
					confirm.hide();
					createRepository(this);
				}
				confirm.cancelClick = () => {
					routeAssignUrl('/', this);
					confirm.hide();
				}
				confirm.show();
			}
		});
	},
	data: function() {
		return {
			isDialogShow: false,
			dialog: {
				title: '컨펌',
				content: '내용',
				ok: 'ok',
				cancel: 'cancel',
				okClick: () => { this.dialog.hide(); },
				cancelClick: () => { this.dialog.hide(); },
				show: () => {
					this.isDialogShow = true;
				},
				hide: () => {
					this.isDialogShow = false;
				}
			}
		}
	},
};
</script>
