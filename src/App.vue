<template>
	<v-app>
		<Header/>

		<router-view/>
	</v-app>
</template>
<script>
import HeaderComponent from './views/Header';

export default {
	components: {
		Header: HeaderComponent
	}
}
</script>
