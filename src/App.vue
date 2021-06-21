<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
	<div ref="test" id="test-id">
		{{ some }}
	</div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
	name: 'App',
	components: {
		HelloWorld
	},
	mounted() {
		console.log(this.$refs.test.innerHTML);
		console.log(document.querySelector('#test-id').innerHTML);
	},
	data() {
		return {
			some: 'ttttttt',
		}
	}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
