// TODO: link, text color, background color, font, tag, code, size, image

const getButtonByIcon = (selector) => {
	let icon = document.querySelector(selector);
	if ( icon ) {
		let span = icon.parentNode;
		if ( span ) {
			return span.parentNode;
		}
	}
};

// eslint-disable-next-line
const getButtonByIconAll = (selector) => {
	let icons = document.querySelectorAll(selector);
	if ( icons ) {
		let spans = [];
		icons.forEach(icon => {
			spans.push( icon.parentNode );
		});

		let buttons = [];
		spans.forEach(span => {
			buttons.push(span.parentNode);
		});
		return buttons;
	}
	return [];
};

export const textToolbarInit = () => {
	//////////////////////// toolbar-text
	

	////////////////////////

	let bold = getButtonByIcon('#toolbar-text div.v-btn-toggle.custom i.mdi-format-bold');
	if ( bold ) {
		bold.addEventListener('click', () => {
			let realBoldButton = document.querySelector('#ve-toolbar-bold');
			if ( realBoldButton ) {
				realBoldButton.click();
			}
		});
	}

	let italic = getButtonByIcon('#toolbar-text div.v-btn-toggle.custom i.mdi-format-italic');
	if ( italic ) {
		italic.addEventListener('click', () => {
			let realItalicButton = document.querySelector('#ve-toolbar-italic');
			if ( realItalicButton ) {
				realItalicButton.click();
			}
		});
	}

	let underline = getButtonByIcon('#toolbar-text div.v-btn-toggle.custom i.mdi-format-underline');
	if ( underline ) {
		underline.addEventListener('click', () => {
			let realUnderButton = document.querySelector('#ve-toolbar-underline');
			if ( realUnderButton ) {
				realUnderButton.click();
			}
		});
	}

	let strike = getButtonByIcon('#toolbar-text div.v-btn-toggle.custom i.mdi-format-strikethrough-variant');
	if ( strike ) {
		strike.addEventListener('click', () => {
			let realStrikeButton = document.querySelector('#ve-toolbar-strikethrough');
			if ( realStrikeButton ) {
				realStrikeButton.click();
			}
		});
	}

	let sub = getButtonByIcon('#toolbar-text div.v-btn-toggle.custom i.mdi-format-subscript');
	if ( sub ) {
		sub.addEventListener('click', () => {
			let realSubButton = document.querySelector('#ve-toolbar-subscript');
			if ( realSubButton ) {
				realSubButton.click();
			}
		});
	}

	let super_ = getButtonByIcon('#toolbar-text div.v-btn-toggle.custom i.mdi-format-superscript');
	if ( super_ ) {
		super_.addEventListener('click', () => {
			let realSuperButton = document.querySelector('#ve-toolbar-superscript');
			if ( realSuperButton ) {
				realSuperButton.click();
			}
		});
	}

	////////////////////////
	
	let unlink = getButtonByIcon('#toolbar-text i.mdi-link-variant-minus');
	if ( unlink ) {
		unlink.addEventListener('click', () => {
			let realUnlinkButton = document.querySelector('#ve-toolbar-unlink');
			if ( realUnlinkButton ) {
				realUnlinkButton.click();
			}
		});
	}
};

export const textFrontColorChange = function() {
	let editor = this.$refs.vueditor;
	let toolbar = this.tb;

	editor.setFrontColorCode(toolbar.toggle.tColor);
}

export const textBackColorChange = function() {
	let editor = this.$refs.vueditor;
	let toolbar = this.tb;

	editor.setBackColorCode(toolbar.toggle.bColor);
}

export const tagChange = function() {
	let editor = this.$refs.vueditor;
	let toolbar = this.tb;

	editor.setTag(toolbar.tag.cur);
}

export const fontChange = function() {
	let editor = this.$refs.vueditor;
	let toolbar = this.tb;

	editor.setFont(toolbar.font.cur);
}

export const sizeChange = function() {
	let editor = this.$refs.vueditor;
	let toolbar = this.tb;

	editor.setFontSize(toolbar.size.cur);
}

export const toolbarInit = (_this) => {
	//let $colorPicker = document.querySelector('#color-picker');

	let toolbar = _this.tb;
	let editor = _this.$refs.vueditor;

	//////////////////////// toolbar-1

	let eraser = getButtonByIcon('#toolbar-1 i.mdi-eraser');
	if ( eraser ) {
		eraser.addEventListener('click', () => {
			let realEraserButton = document.querySelector('#ve-toolbar-eraser');
			if ( realEraserButton ) {
				realEraserButton.click();
			}
		});
	}

	let undo = getButtonByIcon('#toolbar-1 i.mdi-undo');
	if ( undo ) {
		undo.addEventListener('click', () => {
			let realUndoButton = document.querySelector('#ve-toolbar-undo');
			if ( realUndoButton ){
				realUndoButton.click();
			}
		});
	}

	let redo = getButtonByIcon('#toolbar-1 i.mdi-redo');
	if ( redo ) {
		redo.addEventListener('click', () => {
			let realRedoButton = document.querySelector('#ve-toolbar-redo');
			if ( realRedoButton ) {
				realRedoButton.click();
			}
		});
	}

	////////////////////////

	let alignLeft = getButtonByIcon('#toolbar-1 div.v-btn-toggle.custom i.mdi-format-align-left');
	if ( alignLeft ) {
		alignLeft.addEventListener('click', () => {
			let realALButton = document.querySelector('#ve-toolbar-align-left');
			if ( realALButton ) {
				realALButton.click();
			}
		});
	}

	let alignCenter = getButtonByIcon('#toolbar-1 div.v-btn-toggle.custom i.mdi-format-align-center');
	if ( alignCenter ) {
		alignCenter.addEventListener('click', () => {
			let realACButton = document.querySelector('#ve-toolbar-align-center');
			if ( realACButton ) {
				realACButton.click();
			}
		});
	}

	let alignRight = getButtonByIcon('#toolbar-1 div.v-btn-toggle.custom i.mdi-format-align-right');
	if ( alignRight ) {
		alignRight.addEventListener('click', () => {
			let realARButton = document.querySelector('#ve-toolbar-align-right');
			if ( realARButton ) {
				realARButton.click();
			}
		});
	}

	let alignJustify = getButtonByIcon('#toolbar-1 div.v-btn-toggle.custom i.mdi-format-align-justify');
	if ( alignJustify ) {
		alignJustify.addEventListener('click', () => {
			let realAJButton = document.querySelector('#ve-toolbar-align-justify');
			if ( realAJButton ) {
				realAJButton.click();
			}
		});
	}

	let title = getButtonByIcon('#toolbar-1 i.mdi-format-title');
	if ( title ) {
		title.addEventListener('click', () => {
			if ( toolbar.select === "text" ) {
				// selected
				toolbar.select = "";
			} else {
				toolbar.select = "text";
			}
		});
	}

	////////////////////////
	
	let image = getButtonByIcon('#toolbar-1 .mdi-image-multiple');
	if ( image ) {
		// TODO: Image Upload
	}

	let table = getButtonByIcon('#toolbar-1 i.mdi-table-large-plus');
	if ( table ) {
		table.addEventListener('click', () => {
			toolbar.toggle.tableDialog = true;
		});
	}

	let codeView = getButtonByIcon('#toolbar-1 i.mdi-xml');
	if ( codeView ) {
		codeView.addEventListener('click', () => {
			let realCVButton = document.querySelector('#ve-toolbar-code');
			if ( realCVButton ) {
				realCVButton.click();
			}
		});
	}

	let mdView = getButtonByIcon('#toolbar-1 i.mdi-markdown');
	if ( mdView ) {
		mdView.addEventListener('click', () => {
			let realMVButton = document.querySelector('#ve-toolbar-markdown');
			if ( realMVButton ) {
				realMVButton.click();
			}
		});
	}

	////////////////////////
	
	//toolbar.code.list
	toolbar.tag.list = editor.getTagList();
	toolbar.font.list = editor.getFontList();
	toolbar.size.list = editor.getFontSizeList();

	////////////////////////

	let bold = getButtonByIcon('#toolbar-1 div.v-btn-toggle.custom i.mdi-format-bold');
	if ( bold ) {
		bold.addEventListener('click', () => {
			let realBoldButton = document.querySelector('#ve-toolbar-bold');
			if ( realBoldButton ) {
				realBoldButton.click();
			}
		});
	}

	let italic = getButtonByIcon('#toolbar-1 div.v-btn-toggle.custom i.mdi-format-italic');
	if ( italic ) {
		italic.addEventListener('click', () => {
			let realItalicButton = document.querySelector('#ve-toolbar-italic');
			if ( realItalicButton ) {
				realItalicButton.click();
			}
		});
	}

	let underline = getButtonByIcon('#toolbar-1 div.v-btn-toggle.custom i.mdi-format-underline');
	if ( underline ) {
		underline.addEventListener('click', () => {
			let realUnderButton = document.querySelector('#ve-toolbar-underline');
			if ( realUnderButton ) {
				realUnderButton.click();
			}
		});
	}

	let strike = getButtonByIcon('#toolbar-1 div.v-btn-toggle.custom i.mdi-format-strikethrough-variant');
	if ( strike ) {
		strike.addEventListener('click', () => {
			let realStrikeButton = document.querySelector('#ve-toolbar-strikethrough');
			if ( realStrikeButton ) {
				realStrikeButton.click();
			}
		});
	}

	let sub = getButtonByIcon('#toolbar-1 div.v-btn-toggle.custom i.mdi-format-subscript');
	if ( sub ) {
		sub.addEventListener('click', () => {
			let realSubButton = document.querySelector('#ve-toolbar-subscript');
			if ( realSubButton ) {
				realSubButton.click();
			}
		});
	}

	let super_ = getButtonByIcon('#toolbar-1 div.v-btn-toggle.custom i.mdi-format-superscript');
	if ( super_ ) {
		super_.addEventListener('click', () => {
			let realSuperButton = document.querySelector('#ve-toolbar-superscript');
			if ( realSuperButton ) {
				realSuperButton.click();
			}
		});
	}

	////////////////////////
	
	let unlink = getButtonByIcon('#toolbar-1 i.mdi-link-variant-minus');
	if ( unlink ) {
		unlink.addEventListener('click', () => {
			let realUnlinkButton = document.querySelector('#ve-toolbar-unlink');
			if ( realUnlinkButton ) {
				realUnlinkButton.click();
			}
		});
	}

	//////////////////////// toolbar-2
	
	alignLeft = getButtonByIcon('#toolbar-2 div.v-btn-toggle.custom i.mdi-format-align-left');
	if ( alignLeft ) {
		alignLeft.addEventListener('click', () => {
			let realALButton = document.querySelector('#ve-toolbar-align-left');
			if ( realALButton ) {
				realALButton.click();
			}
		});
	}

	alignCenter = getButtonByIcon('#toolbar-2 div.v-btn-toggle.custom i.mdi-format-align-center');
	if ( alignCenter ) {
		alignCenter.addEventListener('click', () => {
			let realACButton = document.querySelector('#ve-toolbar-align-center');
			if ( realACButton ) {
				realACButton.click();
			}
		});
	}

	alignRight = getButtonByIcon('#toolbar-2 div.v-btn-toggle.custom i.mdi-format-align-right');
	if ( alignRight ) {
		alignRight.addEventListener('click', () => {
			let realARButton = document.querySelector('#ve-toolbar-align-right');
			if ( realARButton ) {
				realARButton.click();
			}
		});
	}

	alignJustify = getButtonByIcon('#toolbar-2 div.v-btn-toggle.custom i.mdi-format-align-justify');
	if ( alignJustify ) {
		alignJustify.addEventListener('click', () => {
			let realAJButton = document.querySelector('#ve-toolbar-align-justify');
			if ( realAJButton ) {
				realAJButton.click();
			}
		});
	}
	
	////////////////////////

	bold = getButtonByIcon('#toolbar-2 div.v-btn-toggle.custom i.mdi-format-bold');
	if ( bold ) {
		bold.addEventListener('click', () => {
			let realBoldButton = document.querySelector('#ve-toolbar-bold');
			if ( realBoldButton ) {
				realBoldButton.click();
			}
		});
	}

	italic = getButtonByIcon('#toolbar-2 div.v-btn-toggle.custom i.mdi-format-italic');
	if ( italic ) {
		italic.addEventListener('click', () => {
			let realItalicButton = document.querySelector('#ve-toolbar-italic');
			if ( realItalicButton ) {
				realItalicButton.click();
			}
		});
	}

	underline = getButtonByIcon('#toolbar-2 div.v-btn-toggle.custom i.mdi-format-underline');
	if ( underline ) {
		underline.addEventListener('click', () => {
			let realUnderButton = document.querySelector('#ve-toolbar-underline');
			if ( realUnderButton ) {
				realUnderButton.click();
			}
		});
	}

	strike = getButtonByIcon('#toolbar-2 div.v-btn-toggle.custom i.mdi-format-strikethrough-variant');
	if ( strike ) {
		strike.addEventListener('click', () => {
			let realStrikeButton = document.querySelector('#ve-toolbar-strikethrough');
			if ( realStrikeButton ) {
				realStrikeButton.click();
			}
		});
	}

	sub = getButtonByIcon('#toolbar-2 div.v-btn-toggle.custom i.mdi-format-subscript');
	if ( sub ) {
		sub.addEventListener('click', () => {
			let realSubButton = document.querySelector('#ve-toolbar-subscript');
			if ( realSubButton ) {
				realSubButton.click();
			}
		});
	}

	super_ = getButtonByIcon('#toolbar-2 div.v-btn-toggle.custom i.mdi-format-superscript');
	if ( super_ ) {
		super_.addEventListener('click', () => {
			let realSuperButton = document.querySelector('#ve-toolbar-superscript');
			if ( realSuperButton ) {
				realSuperButton.click();
			}
		});
	}

	////////////////////////
	
	unlink = getButtonByIcon('#toolbar-2 i.mdi-link-variant-minus');
	if ( unlink ) {
		unlink.addEventListener('click', () => {
			let realUnlinkButton = document.querySelector('#ve-toolbar-unlink');
			if ( realUnlinkButton ) {
				realUnlinkButton.click();
			}
		});
	}
}
