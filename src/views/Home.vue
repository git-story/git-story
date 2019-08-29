<template>
	<v-content>
		<v-parallax src="../assets/home-banner.png">
			<v-row
				align="start"
				justify="start"
				style="padding-left:8%">
				<v-col style="margin-top:5rem">
					<v-row>
						<h1 class="font-weight-black" style="color:#880E4F; font-size:65px;">GIT STORY</h1>
					</v-row>
					<v-row>
						<h2 class="display-1 font-weight-medium" style="color:#C51162;">당신의 이야기를 꾸미세요!</h2>
					</v-row>
				</v-col>
			</v-row>
		</v-parallax>
		<v-row 
			align="center"
			style="height:800px; background-color:#B4C6F0;">
			<v-col 
				:cols="5"
				style="padding:0">
				<v-img width="100%" src="../assets/home-image-1.png"></v-img>
			</v-col>
			<v-col align="end" style="padding-right:10%">
				<h1></h1>
			</v-col>
		</v-row>
	</v-content>
</template>

<script>
export default {
	name: 'Home',
	components: {
	},
	methods: {
		test: function() {
		}
	},
	data: () => ({
		//
	}),
};
</script>
