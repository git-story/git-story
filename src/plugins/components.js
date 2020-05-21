import Vue from 'vue';

// components
import ConfirmComponent from '@/Components/Confirm.vue';
import ModalComponent from '@/Components/Modal.vue';
import LoaderComponent from '@/Components/Loader.vue';

Vue.mixin({
    /*
    methods: {
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
                instance.show = false;
                Vue.nextTick(() => {
                    instance.$el.parentNode.remove();
                    //instance.$el.remove();
                    instance = null;
                });
            });

            instance.$mount();
            document.body.appendChild(instance.$el);
        },
    },
    */
});


class Modal {
    constructor(component, vuetify) {
        this.component = component;
        this.instance = new component({
            propsData: {
                open: false,
            },
            vuetify,
        });
        this.instance.$mount();
        document.body.appendChild(this.instance.$el);

        this.addedEvent = false;

        this.instance.$on('ok', (evt) => {
            if ( typeof this.ok === "function" ) {
                this.ok(this.instance, evt);
            }

            this.instance.open = false;

            const content = this.content;
            content.style.backgroundColor = 'unset';
            content.style.display = 'none';
        });
    }

    stopClickEvent (evt) {
        evt.stopPropagation();
        return false;
    }

    get content() {
        const childrens = this.instance.$children;
        const refs = childrens[0].$refs;
        const content = refs.content;
        return content;
    }

    set okFunc(func) {
        this.ok = func;
    }

    show(options = {}) {
        const defaultOptions = {
            open: true,
            title: 'Confirm Title',
            content: 'Confirm Content',
            textOk: 'Ok',
        };

        for ( const [key, val] of Object.entries(options) ) {
            if ( typeof defaultOptions[key] !== "undefined" ) {
                defaultOptions[key] = val;
            }
        }

        for ( const [key, val] of Object.entries(defaultOptions) ) {
            this.instance[key] = val;
        }

        this.okFunc = options.ok;

        Vue.nextTick(() => {
            const content = this.content;
            content.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            content.style.pointerEvents = 'unset';
            content.style.display = 'flex';
            if ( this.addedEvent === false ) {
                content.addEventListener('click', this.stopClickEvent);
                this.addedEvent = true;
            }
        });
    }
}

class Confirm {
    constructor(component, vuetify) {
        this.component = component;
        this.instance = new component({
            propsData: {
                open: false,
            },
            vuetify,
        });
        this.instance.$mount();
        document.body.appendChild(this.instance.$el);

        this.addedEvent = false;

        this.instance.$on('ok', (evt) => {
            if ( typeof this.ok === "function" ) {
                this.ok(this.instance, evt);
            }

            this.instance.open = false;

            const content = this.content;
            content.style.backgroundColor = 'unset';
            content.style.display = 'none';
        });

        this.instance.$on('cancel', (evt) => {
            if ( typeof this.cancel === "function" ) {
                this.cancel(this.instance, evt);
            }

            this.instance.open = false;

            const content = this.content;
            content.style.backgroundColor = 'unset';
            content.style.display = 'none';
        });
    }

    stopClickEvent (evt) {
        evt.stopPropagation();
        return false;
    }

    get content() {
        const childrens = this.instance.$children;
        const refs = childrens[0].$refs;
        const content = refs.content;
        return content;
    }

    set okFunc(func) {
        this.ok = func;
    }

    set cancelFunc(func) {
        this.cancel = func;
    }

    show(options = {}) {
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

        for ( const [key, val] of Object.entries(defaultOptions) ) {
            this.instance[key] = val;
        }

        this.okFunc = options.ok;
        this.cancelFunc = options.cancel;

        Vue.nextTick(() => {
            const content = this.content;
            content.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            content.style.pointerEvents = 'unset';
            content.style.display = 'flex';
            if ( this.addedEvent === false ) {
                content.addEventListener('click', this.stopClickEvent);
                this.addedEvent = true;
            }
        });
    }
}

class Loader {
    constructor(component, vuetify) {
        this.component = component;
        this.instance = new component({
            propsData: {
                open: false,
            },
            vuetify,
        });
        this.isMounted = false;
    }


    set text(txt) {
        this.instance.text = txt;
    }

    set content(txt) {
        this.instance.content = txt;
    }

    get content() {
        const childrens = this.instance.$children;
        const refs = childrens[0].$refs;
        return refs.content;
    }

    stopClickEvent (evt) {
        evt.stopPropagation();
        return false;
    }

    start(txt = "", content = "") {
        if ( this.isMounted === false ) {
            this.instance.$mount();
            document.body.appendChild(this.instance.$el);
        }
        if ( this.instance.open === false ) {
            this.instance.txt = txt;
            this.instance.content = content;
            this.instance.open = true;

            Vue.nextTick(() => {
                const content = this.content;
                content.style.display = 'flex';
                content.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                content.style.pointerEvents = 'unset';

                if ( this.isMounted === false ) {
                    content.addEventListener('click', this.stopClickEvent);
                    this.isMounted = true;
                }
            });
        }
    }

    stop() {
        this.instance.open = false;
        const content = this.content;
        content.style.backgroundColor = 'unset';
        content.style.display = 'none';
    }
}

export default {
    install(Vue, options) {
        const loader = new Loader(Vue.extend(LoaderComponent), options.vuetify);
        const confirm = new Confirm(Vue.extend(ConfirmComponent), options.vuetify);
        const modal = new Modal(Vue.extend(ModalComponent), options.vuetify);

        Vue.prototype.$loader = loader;
        Vue.prototype.$confirm = confirm;
        Vue.prototype.$modal = modal;
    },
};
