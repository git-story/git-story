<!--
 * Home.vue
 * Created on Tue Jul 14 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-main>
		<HomeBanner />
		<v-row class="ma-0 mt-12 pt-12 mb-10 pb-10" justify="center">
			<v-col cols="4" align="center">
				<v-divider class="mt-6" />
			</v-col>
		</v-row>
		<!-- S:Des 1 -->
		<v-row
			align="center">
			<v-col
				sm="12"
				md="5"
				align="center"
				style="padding:0">
				<v-img width="100%" :src="imgs.img1"></v-img>
			</v-col>
			<v-col align="center" style="padding-left:10%; padding-right:10%">
				<v-row>
					<v-col>
						<h1 class="display-1 font-weight-bold indigo--text text--darken-4"> {{ $t('home.des1.title') }} </h1>
					</v-col>
				</v-row>
				<v-row style="margin-top:2rem;">
					<v-col>
						<h2 class="title"> {{ $t('home.des1.content') }} </h2>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<!-- E:Des 1 -->
		<v-row class="ma-0 my-12 py-6" justify="center">
			<v-col cols="4" align="center">
				<v-divider class="mt-6" />
			</v-col>
		</v-row>
		<!-- S:Des 2 -->
		<v-row
			align="center">
			<v-col align="center" style="padding-left:10%; padding-right:10%">
				<v-row>
					<v-col>
						<h1 class="display-1 text-center font-weight-bold indigo--text text--darken-4"> {{ $t('home.des2.title') }} </h1>
					</v-col>
				</v-row>
				<v-row style="margin-top:2rem;">
					<v-col>
						<h2 class="title" v-html="$t('home.des2.content')"></h2>
					</v-col>
				</v-row>
			</v-col>
			<v-col
				sm="12"
				md="5"
				align="center"
				style="padding:0">
				<v-img width="100%" :src="imgs.img2"></v-img>
			</v-col>
		</v-row>
		<!-- E:Des 2 -->
		<v-row class="ma-0 my-12 py-6" justify="center">
			<v-col cols="4" align="center">
				<v-divider class="mt-6" />
			</v-col>
		</v-row>
		<!-- S:Des 3 -->
		<v-row
			align="center">
			<v-col
				sm="12"
				md="5"
				align="center"
				style="padding:0">
				<v-img width="80%" :src="imgs.img3"></v-img>
			</v-col>
			<v-col align="center" style="padding-left:10%; padding-right:10%">
				<v-row>
					<v-col>
						<h1 class="display-1 font-weight-bold indigo--text text--darken-4"> {{ $t('home.des3.title') }} </h1>
					</v-col>
				</v-row>
				<v-row style="margin-top:2rem;">
					<v-col>
						<h2 class="title" v-html="$t('home.des3.content')"></h2>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<!-- E:Des 3 -->

		<v-parallax
			dark
			:src="imgs.foot"
			class="mt-12"
			>
			<v-row
				align="center"
				justify="center"
				style="background-color: rgba(0, 0, 0, 0.6)"
				class="ma-0"
				>
				<v-col class="text-center" cols="12">
					<h1 class="display-1 mb-4">{{ $t('home.foot.title') }}</h1>
					<h4 class="subheading font-weight-thin" v-html="$t('home.foot.content')"></h4>
					<v-btn
						rounded large depressed dark
						class="mt-6 indigo">{{ $t('home.foot.btn') }}</v-btn>
				</v-col>
			</v-row>
		</v-parallax>

		<HomeFooter/>
	</v-main>
</template>
<style scope>
.v-parallax__content {
	padding: unset;
}
</style>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import HomeBanner from './HomeBanner.vue';
import HomeFooter from './HomeFooter.vue';
import { Imgs } from 'types/index';

@Component({
	components: {
		HomeBanner,
		HomeFooter,
	},
})
export default class Home extends Mixins(GlobalMixins) {
	private imgs: Imgs = {
		img1: require('assets/home/image-1.svg'),
		img2: require('assets/home/image-2.svg'),
		img3: require('assets/home/image-3.gif'),
		foot: require('assets/home/foot-banner.jpg'),
	};

	public mounted() {
		this.$logger.debug('app', 'Home mounted');
	}
}
</script>
