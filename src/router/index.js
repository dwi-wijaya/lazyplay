import { createRouter, createWebHistory } from 'vue-router'
import SongPage from '../pages/SongPage.vue'
import PlayPage from '../pages/PlayPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'

const routes = [
  { path: '/', component: DashboardPage },
  { path: '/queue', component: SongPage },
  { path: '/play', component: PlayPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
