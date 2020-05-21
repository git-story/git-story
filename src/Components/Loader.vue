<template>
	<v-dialog
		v-model="open"
		persistent
		max-width="500px"
		width="70%">
		<v-card
            falt
            color="transparent">
			<v-card-text>
                <v-row class="ma-0" align="center">
                    <v-col cols="12" align="center">
                        <v-progress-circular
                            size="100"
                            width="2"
                            color="indigo lighten-5"
                            indeterminate>
                        </v-progress-circular>
                    </v-col>
                </v-row>
                <v-row class="ma-0 mt-8" align="center">
                    <v-col cols="12" align="center">
                        <h1 class="white--text">{{ text }}</h1>
                    </v-col>
                </v-row>
                <v-row class="ma-0" align="center">
                    <v-col cols="12" align="center">
                        <span class="white--text subtitle-1">{{ content }}</span>
                    </v-col>
                </v-row>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>
<script>

export default {
	name: 'Modal',
    props: {
        'open': {
            type: Boolean,
            default: false,
        },
        'text': {
            type: String,
            default: 'Loading...',
        },
        'content': {
            type: String,
            default: '',
        },
    },
	methods: {
	},
	data() {
		return {
		}
	}
}
</script>
