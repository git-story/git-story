/*
 * Components.ts
 * Created on Wed Mar 31 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
 */

export interface ComponentOption {
	open?: boolean; // private
	vuetify?: any; // private
	type?: 'none'|'info'|'error'|'success'|'warning';
	content?: string;
}

export interface NotiOption extends ComponentOption {
	timeout?: number;
	horizontal?: 'left'|'center'|'right';
	vertical?: 'top'|'middle'|'bottom';
}

export interface ModalOption extends ComponentOption {
	title?: string;
	textOk?: string;
	loading?: boolean; // private
}

export interface ConfirmOption extends ModalOption {
	textCancel?: string;
}
