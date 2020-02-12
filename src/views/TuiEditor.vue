<template>
	<div id="tui-editor"></div>
</template>
<style>
#tui-editor .tui-colorpicker-palette-container ul {
	margin: 0px;
	padding: 0px;
}

#tui-editor .te-editor-section {
}

#tui-editor .tui-colorpicker-clearfix {
	zoom: 1;
	margin-top: 5px;
}

#tui-editor .tui-colorpicker-palette-container li {
	float: left;
	margin: 0;
	list-style: none;
}

#tui-editor .tui-colorpicker-slider-container {
	margin: 5px 0 0 0;
	height: 122px;
	zoom: 1;
	display: block;
}

#tui-editor .tui-popup-color .tui-colorpicker-container .tui-colorpicker-palette-preview {
	width: 26px;
    height: 26px;
	display: inline-block;
    vertical-align: middle;
    overflow: hidden;
	margin-right: 5px;
    zoom: 1;
}

#tui-editor  .tui-popup-color .tui-colorpicker-container .tui-colorpicker-palette-hex {
	display: inline-block;
	width: 80px;
	vertical-align: middle;
	overflow: hidden;
	zoom: 1;
}

#tui-editor .tui-popup-color .te-apply-button {
	height: 26px;
	right: 8px;
	bottom: 137px;
}

#tui-editor .tui-colorpicker-slider-left {
    float: left;
    width: 120px;
    height: 120px;
}

#tui-editor .tui-colorpicker-svg-slider {
	width: 120px;
	height: 120px;
	overflow: hidden;
	display: block;
}

#tui-eidtor .tui-popup-color
	.tui-colorpicker-slider-container
	.tui-colorpicker-slider-right {
	width: 22px;
	float: right;
	height: 120px;
}

#tui-editor .tui-colorpicker-svg-huebar {
    float: right;
    width: 18px;
    height: 120px;
    border: 1px solid #ccc;
    overflow: visible;
}

#tui-editor pre > code {
    font-weight: 400!important;
    width: 100%;
    background-color: #f5f7f8;
    color: unset;
    -webkit-box-shadow: unset;
    box-shadow: unset;
}

#tui-editor pre > code:after,
#tui-editor pre > code:before {
    content: unset;
}

</style>
<script>
// import { Editor } from '@toast-ui/vue-editor';
//import TuiEditor from 'tui-editor';
import 'tui-editor/dist/tui-editor-extColorSyntax.min.js';
import 'tui-editor/dist/tui-editor-extScrollSync.min.js';
import ToastUIEditor from 'tui-editor/dist/tui-editor-Editor.js';

export default {
	name: 'TuiEditor',
	coponents: {
	},
	methods: {
		getValues() {
			const val = { md: '', html: '' };
			const editor = this.editor;

			try { 
				// editor.changeMode('markdown');
				document.querySelector('#tui-editor .te-switch-button.markdown').click();
				document.querySelector('#tui-editor .te-tab button[data-index="1"]').click();
				val.html = editor.preview.$el.html();
				val.md = editor.getValue();
			} catch(err) {
				// eslint-disable-next-line
				console.error(err);
			}

			return val;
		},
	},
	mounted() {
		this.editor = new ToastUIEditor({
			el: document.querySelector('#tui-editor'),
			initialEditType: 'markdown',
			previewStyle: 'tab',
			height: '100%',
			language: 'ko_KR',
			exts: ['colorSyntax', 'scrollSync'],
			toolbarItems: [
				'heading', 'bold', 'italic', 'strike', 'divider', 'hr',
				'quote', 'ul', 'ol', 'task', 'indent', 'outdent', 'divider',
				'table', 'image', 'link', 'divider', 'code', 'codeblock',
			],
		});
	},
	data: function() {
		return {
			tuiOptions: {
				language: 'ko_KR',
			}
		};
	},
};
</script>
