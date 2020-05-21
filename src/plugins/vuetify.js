import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import ko from '@/languages/ko/';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    lang: {
        locales: { ko },
        current: 'ko',
    },
    theme: {
        dark: false,
    },
});
