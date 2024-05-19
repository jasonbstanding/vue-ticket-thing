import { createRouter, createWebHistory } from 'vue-router';
import GigList from './views/GigList.vue';

const routes = [
  {
    path: '/',
    name: 'GigList',
    component: GigList
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
