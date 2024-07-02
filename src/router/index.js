import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@stores/user';
import DashboardPage from '@pages/DashboardPage.vue';
import QueuePage from '@pages/QueuePage.vue';
import PlayPage from '@pages/PlayPage.vue';
import Signin from '@pages/auth/Signin.vue';
import Signup from '@pages/auth/Signup.vue';
import UserList from '@pages/users/UserPage.vue';
import RecentPage from '@pages/RecentPage.vue';

const routes = [
  { path: '/', component: DashboardPage, meta: { requiresAuth: true } },
  { path: '/queue', component: QueuePage, meta: { requiresAuth: true } },
  { path: '/play', component: PlayPage, meta: { requiresAuth: true } },
  { path: '/signin', component: Signin, meta: { requiresGuest: true } },
  { path: '/signup', component: Signup, meta: { requiresGuest: true } },
  { path: '/users', component: UserList, meta: { requiresAuth: true } },
  { path: '/recent', component: RecentPage, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {

  const userStore = useUserStore();
  await userStore.fetchUser(); 

  if (to.matched.some(record => record.meta.requiresAuth) && !userStore.user) {
    next('/signin');
  } else if (to.matched.some(record => record.meta.requiresGuest) && userStore.user) {
    next('/');
  } else {
    next();
  }
});

export default router;
