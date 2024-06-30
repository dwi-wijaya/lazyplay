import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '@services/supabase'; // Pastikan ini mengarah ke konfigurasi Supabase Anda

import DashboardPage from '@pages/DashboardPage.vue';
import QueuePage from '@pages/QueuePage.vue';
import PlayPage from '@pages/PlayPage.vue';
import Signin from '@pages/auth/Signin.vue';
import Signup from '@pages/auth/Signup.vue';

const routes = [
  { path: '/', component: DashboardPage, meta: { requiresAuth: true } },
  { path: '/queue', component: QueuePage, meta: { requiresAuth: true } },
  { path: '/play', component: PlayPage, meta: { requiresAuth: true } },
  { path: '/signin', component: Signin, meta: { requiresGuest: true } },
  { path: '/signup', component: Signup, meta: { requiresGuest: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach(async (to, from, next) => {
  const user = await supabase.auth.getSession()

  if (to.matched.some(record => record.meta.requiresAuth) && !user.data.session) {
    next('/signin');
  } else if (to.matched.some(record => record.meta.requiresGuest) && user.data.session) {
    next('/');
  } else {
    next();
  }
});

export default router;
