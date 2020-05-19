<template>
	<v-dialog 
		v-model="open"
		persistent
		max-width="500px"
		width="70%">
		<v-card>
			<v-card-title class="headline">{{ title }}</v-card-title>
			<v-card-text><span v-html="content"></span></v-card-text>
			<v-card-actions>
				<div class="flex-grow-1"></div>

				<v-btn
					color="red darken-1"
					text
					@click="$emit('cancel', $event); $emit('update:open', false);">
					{{ textCancel }}
				</v-btn>

				<v-btn
					color="green darken-1"
					text
					@click="$emit('ok', $event); $emit('update:open', false);">
					{{ textOk }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>

export default {
	name: 'Confirm',
    props: {
        'open': {
            type: Boolean,
            default: false,
        },
        'title': {
            type: String,
            default: 'Confirm Title',
        },
        'content': {
            type: String,
            default: 'Confirm Content',
        },
        'textCancel': {
            type: String,
            default: 'Cancel',
        },
        'textOk': {
            type: String,
            default: 'Ok',
        },
    },
	methods: {
	},
	data: function () {
		return {
		}
	}
}
</script>
