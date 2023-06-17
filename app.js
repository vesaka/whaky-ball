import { createApp } from 'vue'

import App from './App.vue';
import pinia from './lib/pinia';
import router from './lib/router';

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app');