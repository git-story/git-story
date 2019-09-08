<template>
  <div>
    <Vueditor id="editorcontiner" ref="vueditor" v-model="text"></Vueditor>

    <v-btn @click="getContent"> getContent </v-btn>
    <p>
      {{text}}
    </p>
  </div>
</template>


<style scoped>
  .vueditor {
    margin-top: 62px;
    height: 500px;
  }
</style>


<script>
export default {
  name: 'Edit',
	methods: {
    getContent : function() {
      this.text = this.$refs.vueditor.getContent()
    }
	},
	data: () => ({
    text: "Test"
	}),
};
</script>
