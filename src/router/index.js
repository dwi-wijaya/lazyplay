import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@stores/user';
import DashboardPage from '@pages/DashboardPage.vue';
import Voice from '@pages/Voice.vue';
import QueuePage from '@pages/QueuePage.vue';
import PlaylistPage from '@pages/PlaylistPage.vue';
import PlayPage from '@pages/PlayPage.vue';
import Signin from '@pages/auth/Signin.vue';
import Signup from '@pages/auth/Signup.vue';
import RecentPage from '@pages/RecentPage.vue';
import UserList from '@pages/users/UserPage.vue';
import UserCreate from '@pages/users/UserCreate.vue';
import UserView from '@pages/users/UserView.vue';
import UserEdit from '@pages/users/UserEdit.vue';
import Account from '@pages/users/account/Account.vue';
import AccountEdit from '@pages/users/account/AccountEdit.vue';
import ChangePassword from '@pages/users/account/ChangePassword.vue';

const routes = [
  { path: '/', component: DashboardPage, meta: { requiresAuth: true } },
  { path: '/queue', component: QueuePage, meta: { requiresAuth: true } },
  { path: '/playlist', component: PlaylistPage, meta: { requiresAuth: true } },
  { path: '/voice', component: Voice},
  { path: '/play', component: PlayPage, meta: { requiresOperator: true } },
  { path: '/signin', component: Signin, meta: { requiresGuest: true } },
  { path: '/signup', component: Signup, meta: { requiresGuest: true } },
  { path: '/recent', component: RecentPage, meta: { requiresAuth: true } },
  { path: '/account', component: Account, meta: { requiresAuth: true } },
  { path: '/account-edit', component: AccountEdit, meta: { requiresAuth: true } },
  { path: '/change-password', component: ChangePassword, meta: { requiresAuth: true } },
  { path: '/users', component: UserList, meta: { requiresAdmin: true } },
  { path: '/users/create', component: UserCreate, meta: { requiresAdmin: true } },
  { path: '/users/view/:id', component: UserView, meta: { requiresAdmin: true } },
  { path: '/users/edit/:id', component: UserEdit, meta: { requiresAdmin: true } },
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


router.beforeResolve(async (to, from, next) => {
  const userStore = useUserStore();
  await userStore.fetchUser();

  if (to.meta.requiresOperator && !['admin', 'operator'].includes(userStore.user?.user_metadata.role)) {
    next({ path: '/' });
    next();
  }

  if (to.meta.requiresAdmin && userStore.user?.user_metadata.role !== 'admin') {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;
