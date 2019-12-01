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
				v-model="tb.toggle.tColorView0"
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
					<v-btn text color="grey darken-1" @click="tb.toggle.tColorView0=false; textFrontColorChange();" tile>{{ Lang('apply') }}</v-btn>
				</v-card>
			</v-menu>
			<v-menu 
				:close-on-content-click="false"
				offset-y
				transition="slide-y-transition"
				color="white"
				v-model="tb.toggle.bColorView0"
				fixed
				bottom>
				<v-color-picker 
					:hide-mode-switch="true"
					v-model="tb.toggle.bColor"
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
					<v-btn text color="grey darken-1" @click="tb.toggle.bColorView0=false; textBackColorChange();" tile>{{ Lang('apply') }}</v-btn>
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
				name="tag"
				style="max-width:120px"
				hide-details
				class="pa-0"
				overflow
				:items="tb.tag.list"
				v-model="tb.tag.cur"
				@change="tagChange"
				></v-overflow-btn>
			<v-overflow-btn
				depressed
				label="Font"
				name="font"
				style="max-width:150px"
				hide-details
				class="pa-0"
				overflow
				:items="tb.font.list"
				v-model="tb.font.cur"
				@change="fontChange"
				></v-overflow-btn>
			<v-overflow-btn
				depressed
				label="Size"
				name="size"
				style="max-width:130px"
				hide-details
				class="pa-0"
				overflow
				:items="tb.size.list"
				v-model="tb.size.cur"
				@change="sizeChange"
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
				v-model="tb.toggle.tColorView1"
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
					<v-btn text color="grey darken-1" @click="tb.toggle.tColorView1=false; textFrontColorChange();" tile>{{ Lang('apply') }}</v-btn>
				</v-card>
			</v-menu>
			<v-menu 
				:close-on-content-click="false"
				offset-y
				transition="slide-y-transition"
				color="white"
				v-model="tb.toggle.bColorView1"
				fixed
				bottom>
				<v-color-picker 
					:hide-mode-switch="true"
					v-model="tb.toggle.bColor"
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
					<v-btn text color="grey darken-1" @click="tb.toggle.bColorView1=false; textBackColorChange();" tile>{{ Lang('apply') }}</v-btn>
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
			v-model="tb.toggle.tColorView2"
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
				<v-btn text color="grey darken-1" @click="tb.toggle.tColorView2=false; textFrontColorChange();" tile>{{ Lang('apply') }}</v-btn>
			</v-card>
		</v-menu>
		<v-menu 
			:close-on-content-click="false"
			offset-y
			transition="slide-y-transition"
			color="white"
			v-model="tb.toggle.bColorView2"
			fixed
			bottom>
			<v-color-picker 
				:hide-mode-switch="true"
				v-model="tb.toggle.bColor"
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
				<v-btn text color="grey darken-1" @click="tb.toggle.bColorView2=false; textBackColorChange();" tile>{{ Lang('apply') }}</v-btn>
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
				:items="tb.tag.list"
				v-model="tb.tag.cur"
				@change="tagChange"
				></v-overflow-btn>
			<v-overflow-btn
				depressed
				label="Font"
				style="max-width:150px"
				hide-details
				class="pa-0"
				overflow
				:items="tb.font.list"
				v-model="tb.font.cur"
				@change="fontChange"
				></v-overflow-btn>
			<v-overflow-btn
				depressed
				label="Size"
				style="max-width:130px"
				hide-details
				class="pa-0"
				overflow
				:items="tb.size.list"
				v-model="tb.size.cur"
				@change="sizeChange"
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
