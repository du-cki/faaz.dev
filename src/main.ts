import { createApp } from 'vue';
import FloatingVue from 'floating-vue'

import App from './App.vue';
import router from './router';

import './styles/global.css';

const app = createApp(App);

app.use(router);
app.use(FloatingVue, {
    themes: {
        'album-cover': {
            $extend: 'tooltip',
            html: true,
            distance: 10,
        }
    },
});
app.mount('#app');
