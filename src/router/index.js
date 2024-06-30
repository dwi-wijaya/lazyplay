import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@pages/DashboardPage.vue'
import QueuePage from '@pages/QueuePage.vue'
import PlayPage from '@pages/PlayPage.vue'

const routes = [
  { path: '/', component: DashboardPage },
  { path: '/queue', component: QueuePage },
  { path: '/play', component: PlayPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
