<!-- S:Vueditor -->
<v-row class="div-height">
	<v-col>
		<v-row style="height:80px;">
			<v-col sm="1" md="3"></v-col>
			<v-col>
				<v-text-field ref="input-title" color="secondery" class="custom-title" :label="Lang('editor.input-title')"></v-text-field>
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
