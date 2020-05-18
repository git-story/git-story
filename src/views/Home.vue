<template>
	<v-content class="pt-0">
		<v-img src="../assets/home-banner.png">
			<v-row
				align="start"
				justify="start"
				style="padding-left:8%">
				<v-col style="margin-top:6.5vw">
					<v-row>
						<h1 class="font-weight-black" style="color:#880E4F; font-size:6vw;">GIT STORY</h1>
					</v-row>
					<v-row>
						<h2 class="display-1 font-weight-medium" style="color:#C51162; font-size:4vw !important;">{{ $t('home.banner') }}</h2>
					</v-row>
				</v-col>
			</v-row>
		</v-img>
		<v-row 
			align="center"
			style="height:800px;">
			<v-col 
				sm="12"
				md="5"
				style="padding:0">
				<v-img width="100%" src="../assets/home-image-1.png"></v-img>
			</v-col>
			<v-col align="start" style="padding-left:10%; padding-right:10%">
				<v-row>
					<h1 class="display-1 font-weight-bold"> {{ $t('home.des1.title') }} </h1>
				</v-row>
				<v-row style="margin-top:2rem;">
					<h2 class="title"> {{ $t('home.des1.content') }} </h2>
				</v-row>
			</v-col>
		</v-row>

		<Footer/>
	</v-content>
</template>

<script>
import FooterComponent from './Com/Footer';

export default {
	name: 'Home',
	components: {
		Footer: FooterComponent
	},
	methods: {
	},
	mounted: function() {
		let curPName = this.$router.history.current.name;
		if ( curPName === "Home" ) {
			let vContent = document.querySelector('#router-view');
			vContent.style.background = "white";
		}
		this.$evt.$emit('page-loading-end');
	},
	data: () => ({
		//
	}),
};
</script>
