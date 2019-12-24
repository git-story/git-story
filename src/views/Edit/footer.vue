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
<Modal/>
<!-- E:Util Component -->
