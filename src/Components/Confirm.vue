<template>
	<v-dialog 
		v-model="open"
		persistent
		max-width="500px"
		width="70%">
		<v-card tile>
            <v-card-text class="pt-8 px-0 pb-0">
                <v-row class="ma-0 mb-8" align="center">
                    <v-col cols="12" align="center" class="px-12">
                        <h1 class="mb-8">{{ title }}</h1>
                        <span class="subtitle-1" v-html="content"></span>
                    </v-col>
                </v-row>
                <v-row class="ma-0 mb-0" align="center">
                    <v-col cols="6" align="center" class="pa-0">
                        <v-btn
                            color="red darken-2"
                            large tile
                            block depressed text
                            dark
                            @click="$emit('cancel', $event); $emit('update:open', false);">
                            {{ textCancel }}
                        </v-btn>
                    </v-col>
                    <v-col cols="6" align="center" class="pa-0">
                        <v-btn
                            color="indigo accent-2"
                            large tile
                            block depressed
                            dark
                            @click="$emit('ok', $event); $emit('update:open', false);">
                            {{ textOk }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
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
