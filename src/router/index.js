import { createRouter, createWebHistory } from 'vue-router'
import SongPage from '../pages/SongPage.vue'
import PlayPage from '../pages/PlayPage.vue'

const routes = [
  { path: '/', component: SongPage },
  { path: '/play', component: PlayPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
