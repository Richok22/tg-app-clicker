import '/src/assets/style.scss';

import { routes } from './routes/routes.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueTelegram from 'vue-tg';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import i18n from './i18n'; // Import the i18n instance

const pinia = createPinia();

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(VueTelegram);
app.use(i18n); // Use the i18n instance
app.mount('#app');
