import Vue from 'vue';


Vue.mixin({
    methods: {
        $t(key) {
            return this.$vuetify.lang.t('$vuetify.' + key);
        },
        $assign(url) {
            const router = this && this.$router;
            if ( typeof url === "string" && router ) {
                if ( router.history.current.path !== url ) {
                    router.push({ path: url });
                }
            }
        },
    },
});
