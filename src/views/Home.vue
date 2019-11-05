<template>
	<v-content class="pt-0">
		<v-parallax height="600" src="../assets/home-banner.png">
			<v-row
				align="start"
				justify="start"
				style="padding-left:8%">
				<v-col style="margin-top:7rem">
					<v-row>
						<h1 class="font-weight-black" style="color:#880E4F; font-size:65px;">GIT STORY</h1>
					</v-row>
					<v-row>
						<h2 class="display-1 font-weight-medium" style="color:#C51162;">{{ Lang('home.banner') }}</h2>
					</v-row>
				</v-col>
			</v-row>
		</v-parallax>
		<v-row 
			align="center"
			style="height:800px;">
			<v-col 
				:cols="5"
				style="padding:0">
				<v-img width="100%" src="../assets/home-image-1.png"></v-img>
			</v-col>
			<v-col align="start" style="padding-right:10%">
				<v-row>
					<h1 class="display-1 font-weight-bold"> {{ Lang('home.des1.title') }} </h1>
				</v-row>
				<v-row style="margin-top:2rem;">
					<h2 class="title"> {{ Lang('home.des1.content') }} </h2>
				</v-row>
			</v-col>
		</v-row>

		<Footer/>
	</v-content>
</template>

<script>
import FooterComponent from './Com/Footer';
import Lang from '../languages/Lang.js';

export default {
	name: 'Home',
	components: {
		Footer: FooterComponent
	},
	methods: {
		Lang
	},
	data: () => ({
		//
	}),
};
</script>
