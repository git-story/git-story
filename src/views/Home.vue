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
			style="height:800px;">
			<v-col 
				:cols="5"
				style="padding:0">
				<v-img width="100%" src="../assets/home-image-1.png"></v-img>
			</v-col>
			<v-col align="start" style="padding-right:10%">
				<v-row>
					<h1 class="display-1 font-weight-bold">언제 어디서나 가능한 포스팅!</h1>
				</v-row>
				<v-row style="margin-top:2rem;">
					<h2 class="title">PC든, 모바일이든 인터넷만 된다면, Git과 레포지토리가 다운받아져 있지 않아도 언제든지 포스팅을 작성할 수 있습니다.</h2>
				</v-row>
			</v-col>
		</v-row>

		<Footer/>
	</v-content>
</template>

<script>
import FooterComponent from './Footer';

export default {
	name: 'Home',
	components: {
		Footer: FooterComponent
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
