import Vue from 'vue';

// components
import Confirm from '@/views/Util/Confirm.vue';
import Modal from '@/views/Util/Modal.vue';

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
        $confirm(options = {}) {
            const confirm = Vue.extend(Confirm);
            const defaultOptions = {
                open: true,
                title: 'Confirm Title',
                content: 'Confirm Content',
                textOk: 'Ok',
                textCancel: 'Cancel',
            };

            for ( const [key, val] of Object.entries(options) ) {
                if ( typeof defaultOptions[key] !== "undefined" ) {
                    defaultOptions[key] = val;
                }
            }

            let instance = new confirm({
                propsData: defaultOptions,
            });

            instance.$once('ok', (evt) => {
                if ( typeof options.ok === "function" ) {
                    options.ok(instance, evt);
                }
                instance.open = false;
                Vue.nextTick(() => {
                    instance.$el.remove();
                    instance = null;
                });
            });
            instance.$once('cancel', (evt) => {
                if ( typeof options.cancel === "function" ) {
                    options.cancel(instance, evt);
                }
                instance.open = false;
                Vue.nextTick(() => {
                    instance.$el.remove();
                    instance = null;
                });
            });

            instance.$mount();
            document.body.appendChild(instance.$el);
        },
        $modal(options = {}) {
            const modal = Vue.extend(Modal);
            const defaultOptions = {
                open: true,
                title: 'Modal Title',
                content: 'Modal Content',
                textOk: 'Ok',
            };

            for ( const [key, val] of Object.entries(options) ) {
                if ( typeof defaultOptions[key] !== "undefined" ) {
                    defaultOptions[key] = val;
                }
            }

            let instance = new modal({
                propsData: defaultOptions,
            });

            instance.$once('ok', (evt) => {
                if ( typeof options.ok === "function" ) {
                    options.ok(instance, evt);
                }
                instance.open = false;
                Vue.nextTick(() => {
                    instance.$el.remove();
                    instance = null;
                });
            });

            instance.$mount();
            document.body.appendChild(instance.$el);
        },
    },
});
