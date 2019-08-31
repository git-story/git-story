<template>
  <div class="editor">
      <quillEditor
      :options="editorOption"
      />
  </div>
</template>

<style scoped>
  .editor {
    margin-top: 56px;
  }
</style>


<script>

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import hljs from 'highlight.js'

import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'Edit',

	components: {
    quillEditor
	},
	methods: {
		
	},
	data: () => ({
		editorOption: {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image', 'video'],
      ],
      syntax: {
        highlight: text => hljs.highlightAuto(text).value
      }
    }
  },
	}),
};
</script>
