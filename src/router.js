import { createRouter, createWebHistory } from 'vue-router';
import GigList from '@/views/GigList.vue';
import StatsPage from '@/views/Stats.vue';

const routes = [
  {
    path: '/',
    name: 'GigList',
    component: GigList
  },
  {
    path: '/stats',
    name: 'StatsPage',
    component: StatsPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.BASE_URL),
  routes
});

export default router;
