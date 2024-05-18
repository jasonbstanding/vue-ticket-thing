// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Modal } from 'vue3-modal-dialogs';

const app = createApp(App);

app.use(router);
app.use(Modal);

app.mount('#app');
