import { createRouter, createWebHistory } from 'vue-router'
import SongPage from '../pages/SongPage.vue'
import PlayPage from '../pages/PlayPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'

const routes = [
  { path: '/', component: SongPage },
  { path: '/play', component: PlayPage },
  { path: '/dashboard', component: DashboardPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
