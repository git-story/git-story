<template>
	<v-app>
		<Header/>

		<router-view/>
	</v-app>
</template>
<script>
import HeaderComponent from './views/Header';
import FooterComponent from './views/Footer';

export default {
	components: {
		Header: HeaderComponent,
		Footer: FooterComponent
	}
}
</script>
