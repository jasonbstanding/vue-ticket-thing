import { createRouter, createWebHashHistory } from 'vue-router'
import HeatmapView from '../views/HeatmapView.vue'
import SpendView   from '../views/SpendView.vue'
import GigsView      from '../views/GigsView.vue'
import StarburstView from '../views/StarburstView.vue'

const routes = [
  { path: '/',        redirect: '/gigs' },
  { path: '/heatmap', name: 'heatmap', component: HeatmapView },
  { path: '/spend',   name: 'spend',   component: SpendView },
  { path: '/gigs',      name: 'gigs',      component: GigsView },
  { path: '/starburst', name: 'starburst', component: StarburstView },
]

// Hash history requires no server config, making it ideal for GitHub Pages
export default createRouter({
  history: createWebHashHistory(),
  routes,
})
