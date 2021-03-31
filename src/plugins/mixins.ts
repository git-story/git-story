/*
 * mixins.ts
 * Created on Mon Jul 13 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
 */

import Vue from 'vue';
import { Component, Vue as VueDecorator } from 'vue-property-decorator';
import Vuetify from '@/plugins/vuetify';

import Modal from '@/Components/Modal.vue';
import Confirm from '@/Components/Confirm.vue';
import Notification from '@/Components/Notification.vue';

import { NotiOption, ModalOption, ConfirmOption } from '@/interface/Components';

@Component
export default class Mixin extends VueDecorator {

	/*
	 * Must be binding mixin method.
	 * Because sometimes this becomes undefined when call in another scope.
	 */
	constructor() {
		super();

		this.$t = this.$t.bind(this);
		this.mount = this.mount.bind(this);
		this.$assign = this.$assign.bind(this);
	}

	public $t(key: string) {
		const tmp: any = this;
		return tmp.$vuetify.lang.t('$vuetify.' + key);
	}

	public mount(component: any, options: any = {}, selector?: (string | HTMLElement)) {
		const instanceComponent = Vue.extend(component);

		if ( typeof options.vuetify === 'undefined' ) {
			options.vuetify = Vuetify;
		}

		const instance = new instanceComponent(options);
		instance.$mount(selector);

		return instance;
	}

	public $assign(url: string, newTab: boolean = false) {
		if ( newTab ) {
			window.open(url);
			return;
		}

		const router = this && this.$router;
		if ( router ) {
			if ( router.currentRoute.path !== url ) {
				router.push({ path: url });
			}
		}
	}

	public $noti(options: NotiOption = {}): Promise<void> {
		return new Promise((resolve, reject) => {
			const defaultOptions: NotiOption = {
				open: true,
				type: 'none',
				content: 'Snackbar Content',
				timeout: 5000,
				horizontal: 'center',
				vertical: 'middle',
			};

			for ( const [key, val] of Object.entries(options) ) {
				if ( typeof defaultOptions[key] !== 'undefined' ) {
					defaultOptions[key] = val;
				}
			}

			if ( typeof options.vuetify === 'undefined' ) {
				options.vuetify = Vuetify;
			}

			let instance: any = this.mount(Notification, { propsData: defaultOptions });
			setTimeout(() => {
				Vue.nextTick(() => {
					instance.$el.remove();
					instance = null;
				});
				resolve();
			}, defaultOptions.timeout);
			document.body.appendChild(instance.$el);
		});
	}

	public $modal(options: ModalOption = {}): Promise<MouseEvent> {
		return new Promise((resolve, reject) => {
			const defaultOptions: ModalOption = {
				open: true,
				type: 'none',
				title: 'Modal Title',
				content: 'Modal Content',
				textOk: 'Ok',
			};

			for ( const [key, val] of Object.entries(options) ) {
				if ( typeof defaultOptions[key] !== 'undefined' ) {
					defaultOptions[key] = val;
				}
			}

			if ( typeof options.vuetify === 'undefined' ) {
				options.vuetify = Vuetify;
			}

			let instance: any = this.mount(Modal, { propsData: defaultOptions });
			instance.$once('ok', (evt: any) => {
				instance.open = false;
				Vue.nextTick(() => {
					instance.$el.remove();
					instance = null;
				});
				resolve(evt);
			});
			document.body.appendChild(instance.$el);
		});
	}

	public $confirm(options: ConfirmOption = {}): Promise<MouseEvent> {
		return new Promise((resolve, reject) => {
			const defaultOptions: ConfirmOption = {
				open: true,
				type: 'none',
				title: 'Confirm Title',
				content: 'Confirm Content',
				textOk: 'Ok',
				textCancel: 'Cancel',
			};

			for ( const [key, val] of Object.entries(options) ) {
				if ( typeof defaultOptions[key] !== 'undefined' ) {
					defaultOptions[key] = val;
				}
			}

			if ( typeof options.vuetify === 'undefined' ) {
				options.vuetify = Vuetify;
			}

			let instance: any = this.mount(Confirm, { propsData: defaultOptions });
			instance.$once('ok', (evt: MouseEvent) => {
				instance.open = false;
				Vue.nextTick(() => {
					instance.$el.remove();
					instance = null;
					resolve(evt);
				});
			});
			instance.$once('cancel', (evt: MouseEvent) => {
				instance.open = false;
				Vue.nextTick(() => {
					instance.$el.remove();
					instance = null;
					reject(evt);
				});
			});
			document.body.appendChild(instance.$el);
		});
	}

}
