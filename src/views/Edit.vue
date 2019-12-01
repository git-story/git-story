<!-- 2019-12-1 19:08:34
Edit.vue 파일은 Edit/ 폴더 안에 있는 build.js 스크립트로 만들어졌습니다.
build.js 는 해당 폴더의 특정 파일들의 변화를 감시하여 Edit.vue 파일로 만듭니다.
Edit.vue 파일의 모듈화보단 하나의 파일로 만드는 것이 더욱 소스관리에 용이합니다.

해당 파일은 vueditor 컴포넌트를 일부 커스텀하는 코드가 들어있기 때문에
vueditor와의 의존성이 매우 큽니다.

단, toolbarLoad.js 는 예외로
mounted 이벤트가 들어올 때 커스텀 툴바의 이벤트를 연결해주는 스크립트입니다.

절대 Edit.vue를 수정하는 게 아닌, Edit 폴더 안 파일을 수정해 주세요.
-->
<template>
	<v-content>
		<!-- S:Etc Dialog -->
		<v-dialog v-model="tb.toggle.tableDialog" persistent width="80%" max-width="600px">
			<v-card>
				<v-card-title class="headline">{{ Lang('editor.table.create') }}</v-card-title>
				<v-card-text>
					<v-row>
						<v-col md="5">
							<v-text-field :rules="tb.table.rules" v-model="tb.table.row" label="Row"></v-text-field>
						</v-col>
						<v-col align-self="center" align="center" md="2">
							X
						</v-col>
						<v-col md="5">
							<v-text-field :rules="tb.table.rules" v-model="tb.table.col" label="Col"></v-text-field>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red darken-1" text @click="tb.toggle.tableDialog = false">{{ Lang('cancel') }}</v-btn>
					<v-btn color="green darken-1" text @click="createTables(); tb.toggle.tableDialog = false;">{{ Lang('add') }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- E:Etc Dialog -->
		<!-- S:New Editor Toolbar -->
		<div class="custom-toolbar">
			<v-toolbar id="toolbar-1" class="custom-toolbar" dense>
				<!-- S:Work Flow -->
				<v-divider vertical></v-divider>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon tile v-on="on">
							<v-icon>mdi-eraser</v-icon>
						</v-btn>
					</template>
					<span>{{ Lang('editor.toolbar.erase') }}</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon tile v-on="on">
							<v-icon>mdi-undo</v-icon>
						</v-btn>
					</template>
					<span>{{ Lang('editor.toolbar.undo') }}</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon tile v-on="on">
							<v-icon>mdi-redo</v-icon>
						</v-btn>
					</template>
					<span>{{ Lang('editor.toolbar.redo') }}</span>
				</v-tooltip>
				<!-- E:Work Flow -->
				<v-divider vertical></v-divider>
				<!-- S:Text Align -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon tile class="d-md-none" v-on="on" @click="changeAlign">
							<v-icon v-text="'mdi-format-align-' + tb.align[tb.toggle.align]"></v-icon>
						</v-btn>
					</template>
					<span v-text="Lang('editor.toolbar.align-' + tb.align[tb.toggle.align])"></span>
				</v-tooltip>
				<v-btn-toggle
					v-model="tb.toggle.align"
					class="custom d-none d-lg-flex pa-0"
					dense
					group
					madatory>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-align-left</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.align-left') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-align-center</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.align-center') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-align-right</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.align-right') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-align-justify</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.align-justify') }}</span>
					</v-tooltip>
				</v-btn-toggle>
				<!-- E:Text Align -->
				<v-btn-toggle
					class="custom pa-0"
					dense
					group
					madatory>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile class="d-md-none" @click="textBarToggle" active-class="white" v-on="on">
								<v-icon>mdi-format-title</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.text-menu') }}</span>
					</v-tooltip>
				</v-btn-toggle>
				<!-- S:Text Color -->
				<div class="d-none d-lg-flex pa-0">
					<v-divider vertical></v-divider>
					<v-menu 
						:close-on-content-click="false"
						offset-y
						transition="slide-y-transition"
						color="white"
						v-model="tb.toggle.tColorView[0]"
						fixed
						bottom>
						<template v-slot:activator="{ on: menu }">
							<v-tooltip bottom>
								<template v-slot:activator="{ on: tooltip }">
									<v-btn icon tile v-on="{ ...tooltip, ...menu }">
										<v-icon>mdi-format-color-text</v-icon>
									</v-btn>
								</template>
								<span>{{ Lang('editor.toolbar.text-color') }}</span>
							</v-tooltip>
						</template>
						<v-color-picker
							:hide-mode-switch="true"
							v-model="tb.toggle.tColor"
							class="custom-picker"
							mode="hexa"
							show-swatches></v-color-picker>
						<v-card tile color="white" align="right">
							<v-btn text color="grey darken-1" @click="tb.toggle.tColorView[0]=false;" tile>{{ Lang('apply') }}</v-btn>
						</v-card>
					</v-menu>
					<v-menu 
						:close-on-content-click="false"
						offset-y
						transition="slide-y-transition"
						color="white"
						v-model="tb.toggle.bColorView[0]"
						fixed
						bottom>
						<v-color-picker 
							:hide-mode-switch="true"
							v-model="tb.toggle.tColor"
							class="custom-picker"
							mode="hexa"
							show-swatches></v-color-picker>
						<template v-slot:activator="{ on: menu }">
							<v-tooltip bottom>
								<template v-slot:activator="{ on: tooltip }">
									<v-btn icon tile v-on="{ ...tooltip, ...menu }">
										<v-icon>mdi-format-color-fill</v-icon>
									</v-btn>
								</template>
								<span>{{ Lang('editor.toolbar.bg-color') }}</span>
							</v-tooltip>
						</template>
						<v-card tile color="white" align="right">
							<v-btn text color="grey darken-1" @click="tb.toggle.bColorView[0]=false;" tile>{{ Lang('apply') }}</v-btn>
						</v-card>
					</v-menu>
				</div>
				<!-- E:Text Color -->
				<!-- S:Utility -->
				<div class="d-flex pa-0">
					<v-divider vertical class="d-flex d-md-none d-lg-flex"></v-divider>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-image-multiple</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.picture') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-table-large-plus</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.table') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-xml</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.source') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-markdown</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.markdown') }}</span>
					</v-tooltip>
				</div>
				<!-- E:Utility -->
				<!-- S:Text Etc -->
				<div class="d-none d-md-flex pa-0">
					<v-divider vertical></v-divider>
					<v-overflow-btn
						depressed
						label="Code"
						style="max-width:110px"
						hide-details
						class="pa-0"
						overflow
						></v-overflow-btn>
					<v-overflow-btn
						depressed
						label="Tag"
						style="max-width:100px"
						hide-details
						class="pa-0"
						overflow
						></v-overflow-btn>
					<v-overflow-btn
						depressed
						label="Font"
						style="max-width:150px"
						hide-details
						class="pa-0"
						overflow
						></v-overflow-btn>
					<v-overflow-btn
						depressed
						label="Size"
						style="max-width:130px"
						hide-details
						class="pa-0"
						overflow
						></v-overflow-btn>
				</div>
				<!-- E:Text Etc -->
				<!-- S:Text Format -->
				<v-btn-toggle 
					v-model="tb.toggle.format"
					class="d-none d-lg-flex pa-0 custom"
					dense
					group
					multiple
					madatory>
					<v-divider vertical></v-divider>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-bold</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.bold') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-italic</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.italic') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-underline</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.underline') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-strikethrough-variant</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.strike') }}</span>
					</v-tooltip>
				</v-btn-toggle>
				<v-btn-toggle 
					v-model="tb.toggle.super_sub"
					class="d-none d-lg-flex pa-0 custom"
					dense
					group
					madatory>
					<v-divider vertical></v-divider>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-subscript</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.sub') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-superscript</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.super') }}</span>
					</v-tooltip>
				</v-btn-toggle>
				<div class="d-none d-lg-flex pa-0">
					<v-divider vertical></v-divider>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-link-variant-plus</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.link') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-link-variant-minus</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.unlink') }}</span>
					</v-tooltip>
				</div>
				<!-- E:Text Format -->
			</v-toolbar>
			<v-toolbar id="toolbar-2" class="custom-toolbar d-none d-md-flex d-lg-none" dense>
				<!-- S:Text Align -->
				<v-btn-toggle
					v-model="tb.toggle.align"
					class="custom d-flex pa-0"
					dense
					group
					madatory>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-align-left</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.align-left') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-align-center</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.align-center') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-align-right</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.align-right') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-align-justify</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.align-justify') }}</span>
					</v-tooltip>
				</v-btn-toggle>
				<!-- E:Text Align -->
				<!-- S:Text Color -->
				<v-divider vertical></v-divider>
					<v-menu 
						:close-on-content-click="false"
						offset-y
						transition="slide-y-transition"
						color="white"
						v-model="tb.toggle.tColorView[1]"
						fixed
						bottom>
						<template v-slot:activator="{ on: menu }">
							<v-tooltip bottom>
								<template v-slot:activator="{ on: tooltip }">
									<v-btn icon tile v-on="{ ...tooltip, ...menu }">
										<v-icon>mdi-format-color-text</v-icon>
									</v-btn>
								</template>
								<span>{{ Lang('editor.toolbar.text-color') }}</span>
							</v-tooltip>
						</template>
						<v-color-picker 
							:hide-mode-switch="true"
							v-model="tb.toggle.bColor"
							class="custom-picker"
							mode="hexa"
							show-swatches></v-color-picker>
						<v-card tile color="white" align="right">
							<v-btn text color="grey darken-1" @click="tb.toggle.tColorView[1]=false;" tile>{{ Lang('apply') }}</v-btn>
						</v-card>
					</v-menu>
					<v-menu 
						:close-on-content-click="false"
						offset-y
						transition="slide-y-transition"
						color="white"
						v-model="tb.toggle.bColorView[1]"
						fixed
						bottom>
						<v-color-picker 
							:hide-mode-switch="true"
							v-model="tb.toggle.tColor"
							class="custom-picker"
							mode="hexa"
							show-swatches></v-color-picker>
						<template v-slot:activator="{ on: menu }">
							<v-tooltip bottom>
								<template v-slot:activator="{ on: tooltip }">
									<v-btn icon tile v-on="{ ...tooltip, ...menu }">
										<v-icon>mdi-format-color-fill</v-icon>
									</v-btn>
								</template>
								<span>{{ Lang('editor.toolbar.bg-color') }}</span>
							</v-tooltip>
						</template>
						<v-card tile color="white" align="right">
							<v-btn text color="grey darken-1" @click="tb.toggle.bColorView[1]=false;" tile>{{ Lang('apply') }}</v-btn>
						</v-card>
					</v-menu>
				<!-- E:Text Color -->
				<!-- S:Text Format -->
				<v-divider vertical></v-divider>
				<v-btn-toggle 
					v-model="tb.toggle.format"
					class="pa-0 custom"
					dense
					group
					multiple
					madatory>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-bold</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.bold') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-italic</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.italic') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-underline</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.underline') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-strikethrough-variant</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.strike') }}</span>
					</v-tooltip>
				</v-btn-toggle>
				<v-btn-toggle 
					v-model="tb.toggle.super_sub"
					class="pa-0 custom"
					dense
					group
					madatory>
					<v-divider vertical></v-divider>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-subscript</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.sub') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-superscript</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.super') }}</span>
					</v-tooltip>
				</v-btn-toggle>
				<v-divider vertical></v-divider>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon tile v-on="on">
							<v-icon>mdi-link-variant-plus</v-icon>
						</v-btn>
					</template>
					<span>{{ Lang('editor.toolbar.link') }}</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon tile v-on="on">
							<v-icon>mdi-link-variant-minus</v-icon>
						</v-btn>
					</template>
					<span>{{ Lang('editor.toolbar.unlink') }}</span>
				</v-tooltip>
				<!-- E:Text Format -->
			</v-toolbar>
			<v-toolbar id="toolbar-text" class="custom-toolbar d-md-none" v-if="tb.toggle.textBar" dense>
				<v-divider vertical></v-divider>
				<!-- S:Text Color -->
				<v-menu 
					:close-on-content-click="false"
					offset-y
					transition="slide-y-transition"
					color="white"
					v-model="tb.toggle.tColorView[2]"
					fixed
					bottom>
					<template v-slot:activator="{ on: menu }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on: tooltip }">
								<v-btn icon tile v-on="{ ...tooltip, ...menu }">
									<v-icon>mdi-format-color-text</v-icon>
								</v-btn>
							</template>
							<span>{{ Lang('editor.toolbar.text-color') }}</span>
						</v-tooltip>
					</template>
					<v-color-picker 
						:hide-mode-switch="true"
						v-model="tb.toggle.bColor"
						class="custom-picker"
						mode="hexa"
						show-swatches></v-color-picker>
					<v-card tile color="white" align="right">
						<v-btn text color="grey darken-1" @click="tb.toggle.tColorView[2]=false;" tile>{{ Lang('apply') }}</v-btn>
					</v-card>
				</v-menu>
				<v-menu 
					:close-on-content-click="false"
					offset-y
					transition="slide-y-transition"
					color="white"
					v-model="tb.toggle.bColorView[2]"
					fixed
					bottom>
					<v-color-picker 
						:hide-mode-switch="true"
						v-model="tb.toggle.tColor"
						class="custom-picker"
						mode="hexa"
						show-swatches></v-color-picker>
					<template v-slot:activator="{ on: menu }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on: tooltip }">
								<v-btn icon tile v-on="{ ...tooltip, ...menu }">
									<v-icon>mdi-format-color-fill</v-icon>
								</v-btn>
							</template>
							<span>{{ Lang('editor.toolbar.bg-color') }}</span>
						</v-tooltip>
					</template>
					<v-card tile color="white" align="right">
						<v-btn text color="grey darken-1" @click="tb.toggle.bColorView[2]=false;" tile>{{ Lang('apply') }}</v-btn>
					</v-card>
				</v-menu>
				<!-- S:Text Color -->
				<!-- S:Text Etc -->
				<div class="d-flex pa-0">
					<v-divider vertical></v-divider>
					<v-overflow-btn
						depressed
						label="Code"
						style="max-width:110px"
						hide-details
						class="pa-0"
						overflow
						></v-overflow-btn>
					<v-overflow-btn
						depressed
						label="Tag"
						style="max-width:100px"
						hide-details
						class="pa-0"
						overflow
						></v-overflow-btn>
					<v-overflow-btn
						depressed
						label="Font"
						style="max-width:150px"
						hide-details
						class="pa-0"
						overflow
						></v-overflow-btn>
					<v-overflow-btn
						depressed
						label="Size"
						style="max-width:130px"
						hide-details
						class="pa-0"
						overflow
						></v-overflow-btn>
				</div>
				<!-- E:Text Etc -->
				<!-- S:Text Format -->
				<v-divider vertical></v-divider>
				<v-btn-toggle 
					v-model="tb.toggle.format"
					class="d-flex d-md-none pa-0 custom"
					dense
					group
					multiple
					madatory>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-bold</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.bold') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-italic</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.italic') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-underline</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.underline') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-strikethrough-variant</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.strike') }}</span>
					</v-tooltip>
				</v-btn-toggle>
				<v-btn-toggle 
					v-model="tb.toggle.super_sub"
					class="d-flex d-md-none pa-0 custom"
					dense
					group
					madatory>
					<v-divider vertical></v-divider>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-subscript</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.sub') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon tile v-on="on">
								<v-icon>mdi-format-superscript</v-icon>
							</v-btn>
						</template>
						<span>{{ Lang('editor.toolbar.super') }}</span>
					</v-tooltip>
				</v-btn-toggle>
				<v-divider vertical></v-divider>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon tile v-on="on">
							<v-icon>mdi-link-variant-plus</v-icon>
						</v-btn>
					</template>
					<span>{{ Lang('editor.toolbar.link') }}</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon tile v-on="on">
							<v-icon>mdi-link-variant-minus</v-icon>
						</v-btn>
					</template>
					<span>{{ Lang('editor.toolbar.unlink') }}</span>
				</v-tooltip>
				<!-- E:Text Format -->
			</v-toolbar>
		</div>
		<!-- E:New Editor Toolbar -->
		
		<!-- S:Vueditor -->
		<v-row class="div-height">
			<v-col>
				<v-row style="height:80px;">
					<v-col sm="1" md="3"></v-col>
					<v-col>
						<v-text-field ref="input-title" color="secondery" class="custom-title" :label="Lang('editor.input-title')" v-model="title"></v-text-field>
						<Vueditor id="editorcontiner" ref="vueditor" class="custom" v-model="text"></Vueditor>
					</v-col>
					<v-col sm="1" md="3"></v-col>
				</v-row>
				<v-row class="mt-10" style="height:calc(100% - 80px)">
					<v-col height="100%" class="pt-0">
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<!-- E:Vueditor -->
		
		<!-- S:Footer -->
		<v-footer height="80" color="grey lighten-4" fixed class="font-width-medium pl-12 pr-12">
			<v-row align="center">
				<v-col></v-col>
				<v-col align="end">
					<!-- S:Posting -->
					<v-menu
						v-model="menu"
						max-width="500px"
						min-width="500px"
						:close-on-content-click="false"
						transition="slide-y-transition"
						top
						left
						:offset-y="true">
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" elevation="5" tile large color="grey darken-3" style="color:white;">
								{{ Lang('editor.post') }}
							</v-btn>
						</template>
		
						<!-- S:Posting Menu -->
						<v-card class="">
							<v-card-text>
								<v-container>
									<v-row align="center">
										<v-col cols="4">
											<v-subheader>{{ Lang('editor.category') }}</v-subheader>
										</v-col>
										<v-col>
											<v-select
												v-model="c_sel"
												:items="categoryItem"
												item-text="name"
												item-value="value"
												:label="Lang('editor.select')"
												return-object
												single-line></v-select>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>
		
							<v-card-actions>
								<v-spacer></v-spacer>
		
								<v-btn text @click="menu = false">{{ Lang('cancel') }}</v-btn>
								<v-btn color="success" text @click="menu = false; doPosting()">{{ Lang('ok') }}</v-btn>
							</v-card-actions>
						</v-card>
						<!-- E:Posting Menu -->
					</v-menu>
					<!-- E:Posting -->
				</v-col>
			</v-row>
		</v-footer>
		<!-- E:Footer -->
		
		<!-- S:Util Component -->
		<PLoading/>
		<!-- E:Util Component -->
		
	</v-content>
</template>
<style>
body {
	background-color: white;
}

div.v-application {
	background-color: white !important;
}

.vueditor > .ve-toolbar {
	width: 100%;
	position: absolute;
	box-shadow: 0px 0px 5px #cacaca;
	left: 0;

	/* service code */
	top: 0;
	display:none;
	z-index: -1;

	/* debug code */
	/*
	top: 50%;
	display: block;
	z-index: 30;
	*/
}

.vueditor > .ve-design {
	margin-top: 20px;
}

.custom-title.v-text-field .v-label--active {
	transform: translateY(-20px) scale(0.5);
}
.custom-title.v-text-field .v-text-field__slot input {
	font-size: 2rem;
	max-height: 100px;
	line-height: 40px;
	margin-top: 10px;
}
.custom-title.v-text-field .v-text-field__slot label {
	height:70px !important;
	line-height: 50px !important;
	font-size: 2rem;
}

div.custom-toolbar {
	position: fixed;
	z-index: 4;
	width: 100%;
	-webkit-box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
	box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}

div.custom-toolbar header.v-toolbar {
	-webkit-box-shadow: unset;
	box-shadow: unset;
	border-bottom: 1px solid rgb(218, 218, 218);
	overflow-x:auto;
	overflow-y:hidden;
	scrollbar-width: none;
}
div.custom-toolbar header.v-toolbar div {
	padding: 0;
}
div.custom-toolbar header.v-toolbar::-webkit-scrollbar,
div.custom-toolbar header.v-toolbar::-webkit-scrollbar-thumb,
div.custom-toolbar header.v-toolbar::-webkit-scrollbar-track {
	display:none;
}

div.custom-picker {
	border-radius: 0 !important;
}

div.v-btn-toggle.custom button {
	border-top: 0 !important;
	border-left: 0 !important;
	border-right: 0 !important;
	border-bottom: 1px solid rgb(218, 218, 218) !important;
}
div.v-btn-toggle.custom button i {
	color: rgba(0, 0, 0, 0.54) !important;
}

div.vueditor.custom {
	background-color: transparent;
	border: 0;
	width:100%;
}
div.vueditor.custom iframe {
	width:100%;
	position: relative;
}

.div-height {
	height:calc( 100% - 64px );
	padding-bottom: 15px;
	padding-top: 100px;
}

</style>
<script>
import axios from 'axios';
import { getGitData, getGitJsonData, genNowDate, findChildByTagName, routeAssignUrl, getObject, commitGitData, removePost } from '../modules/common.js';
import PLoading from './Util/PLoading';
import Lang from '../languages/Lang.js';
import beautify from 'js-beautify'
import { toolbarInit, textToolbarInit } from './Edit/toolbarLoad.js';

const changeAlign = function() {
	if ( this.tb.toggle.align === 3 ) {
		this.tb.toggle.align = 0;
	} else {
		this.tb.toggle.align += 1;
	}
};

const buildContentHTML = function(_this = this) {
	let contentHTML = _this.$refs.vueditor.getContent();
	let html = document.createElement('html');
	let cfg = _this.config;

	const createChildElement = (e) => {
		let child = document.createElement('div');
		child.innerHTML = e;
		return child.lastElementChild;
	};

	let head = document.createElement('head');
	cfg.head.forEach(e => {
		let child = createChildElement(e);
			head.appendChild(child);
	});
	html.appendChild(head);

	let body = document.createElement('body');
	cfg.body.start.forEach(e => {
		let child = createChildElement(e);
		body.appendChild(child);
	});

	let bodyContent = document.createElement('main');
	bodyContent.innerHTML = contentHTML;
	body.appendChild(bodyContent);

	// comment 
	let commentDiv = document.createElement('div');
	commentDiv.style.marginTop = "10px";

	// disqus
	if ( cfg.comment.disqus ) {
		commentDiv.innerHTML += cfg.comment.disqus;
	}
	
	// utterances
	if ( cfg.comment.utterances ) {
		commentDiv.innerHTML += cfg.comment.utterances;
	}

	// facebook
	if ( cfg.comment.facebook ) {
		commentDiv.innerHTML += cfg.comment.facebook;
	}

	body.appendChild(commentDiv);

	cfg.body.end.forEach(e => {
		let child = createChildElement(e);
		body.appendChild(child);
	});
	html.appendChild(body);
	let outerHTML = html.outerHTML;
	let beautyHTML = beautify.html(outerHTML, true);
	return beautyHTML;
};

const doPostingContent = function() {
	// get posts.json
	if ( this.posts ) {
		let posts = this.posts;
		let posts_sha = this.posts_ori.sha;

		let selectedCategory = this.c_sel.value;

		// 실제 파일은 카테고리와 무관하게
		// 디렉토리를 더 나누지 않고 /posts 아래 바로 위치하도록 수정
		// let path = category.href;
		let path = "/posts/";
		let nowDate = genNowDate();
		
		let requsetBase = `${path}${nowDate}/`
		
		if (this.indexPath.length > 0) { // 편집하는 경우 기존 경로로
			requsetBase = this.indexPath;
		}
		
		let coverImg = null;
		if ( coverImg ) {
			// TODO: 글에서 대표 커버 찾아내는 알고리즘 추가
		} else {
			// 커버 이미지가 없으면 샘플에서 하나 선택
			let coverImgs = this.$store.getters.config['cover-samples'];
			let pickNum = Math.floor(Math.random() * coverImgs.length);
			coverImg = coverImgs[pickNum];
		}
		
		if (this.indexPath.length > 0) {
			// 기존 정보 post.json에서 제거
			removePost({"title": this.title, "href": requsetBase}, axios, this, false);
		}
		let category = getObject(posts, selectedCategory);
		category.posts.push({
			cover: coverImg,
			href: requsetBase,
			title: this.title,
		});

		let commitMsg = `📚 [GITSTORY] 📝 POSTING : [${this.title.toUpperCase()}]`;
		let ploading = findChildByTagName(this, "PLoading");
		ploading.show();

		// posting
		commitGitData(this, axios, '/posts.json', posts, posts_sha, commitMsg)
			.then(() => {
				let contentHTML = buildContentHTML(this);
				let reqUrl = requsetBase + 'index.html';
				commitGitData(this, axios, reqUrl, contentHTML, this.indexSHA, commitMsg)
					.then(() => {
						ploading.hide();
						routeAssignUrl('/my-blog', this);
					});
			});
	}
};

const createCategoryItems = function(posts, id="", level=0) {
	let keys = Object.keys(posts);
	let obj = [];

	keys.forEach((k) => {
		let cat = posts[k];
		let po  = { // push object target
			value: id+k,
			name: ` ${">".repeat(level)} ${k}`
		};

		obj.push(po);
		let subs = cat.sub;
		let skeys = Object.keys(subs);
		if ( skeys.length > 0 ) {
			let next_id = `${id}${k}.sub.`;
			let child = createCategoryItems(subs, next_id, level+1);
			obj = obj.concat(child);
		}

	});

	return obj;
};

const textBarToggle = function() {
	if ( this.tb.toggle.textBar === true ) {
		this.tb.toggle.textBar = false;
	} else {
		this.tb.toggle.textBar = true;
		// 즉시 실행하면 엘리먼트가 추가되기 전에 실행되어서 동작 안 함
		setTimeout( textToolbarInit, 100 );
	}
};

const createTables = function() {
	let table = this.tb.table;
	let editor = this.$refs.vueditor;

	editor.createTable(table.row, table.col);
};

export default {
	name: 'Edit',
	components: {
		PLoading
	},

	props: ['editinfo'],
	methods: {
		doPosting: doPostingContent,
		getContent : function() {
			this.text = this.$refs.vueditor.getContent();
		},
		setContent : function(content) 	{
			this.$refs.vueditor.setContent(content);
		},
		Lang,
		changeAlign,
		textBarToggle,
		createTables,
	},
	mounted: function() {
		
		if (this.editinfo !== undefined)
		{
			this.editMode = true;
			
			//editInfo 에 title 과 href정보가 있다.
			let decodeObject = Buffer.from(this.editinfo, 'base64').toString('utf8');
			let editInfo = JSON.parse(decodeObject);
			let decodeURI = editInfo.href;
			let decodeTitle = editInfo.title;

			getGitData(this, axios, `${decodeURI}index.html`).then(res => {
				
				//파일을 업데이트 하기위한 sha와 경로를 받아오고 editor에 내용을 채워준다.
				this.indexSHA = res.sha;
				this.indexPath = decodeURI;
				this.title = decodeTitle;
				this.setContent(res.decodeData);

			});
		}

		let curPName = this.$router.history.current.name;	
		if ( curPName === "Edit" ) {
			let vContent = document.querySelector('#router-view');
			vContent.style.background = "white";
			
			getGitJsonData(this, axios, "posts.json").then(res => {
				this.posts = res.json;
				this.posts_ori = res;

				this.categoryItem = createCategoryItems(this.posts);
				this.c_sel = this.categoryItem[0];
			});
		}
		
		getGitJsonData(this, axios, "config.json").then(res => {
			this.config = res.json;
			this.config_ori = res;
		});

		// 커스텀 툴바를, vueditor 와 연결
		toolbarInit(this);

	},
	data: () => ({
		text: "Test",
		c_sel: {},
		categoryItem: [],
		menu: false,

		indexSHA: null, // index.html에 대한 sha
		indexPath: "",
		title: "",		
		true_:  true,

		tb: { //toolbar
			lang: 'bash',
			tag: 'p',
			font: 'arial black',
			fsize: '12px',
			align: ['left', 'center', 'right', 'justify'],
			table: {
				rules: [
					(value) => {
						if ( value === undefined ) {
							return "please-input";
						}

						if ( value.toString().match(/[^0-9]/g) ) {
							return Lang("editor.table.only-number");
						}
						return true;
					}
				],
				row: 0,
				col: 0,
			},
			toggle: {
				textBar: false,
				align:0,
				format: [],
				super_sub: [],
				tColor: '#000000',
				tColorView: [false, false, false],
				bColor: '#000000',
				bColorView: [false, false, false],
				tableDialog: false
			},
		}
	}),
};

</script>