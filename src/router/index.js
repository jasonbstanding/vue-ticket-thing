// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import TicketGallery from '../components/TicketGallery.vue';

const routes = [
  { path: '/', component: TicketGallery },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
