import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AuthView from '../views/AuthView.vue';
import SearchResults from '../views/SearchResults.vue';
import RecipeDetails from '../views/RecipeDetails.vue';
import UserProfile from '../views/UserProfile.vue';
import { getAuth } from 'firebase/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
    meta: {
      title: 'Sign In / Sign Up',
      requiresUnauth: true
    }
  },

  {
    path: '/user',
    name: 'UserProfile',
    component: UserProfile
  },

  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults,
    props: route => ({ navbarHeight: route.params.navbarHeight, q: route.query.q })
  },

  {
    path: '/recipe/:id',
    name: 'RecipeDetails',
    component: RecipeDetails,
    props: true,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
})

const auth = getAuth();
let isAuthReady = false;

auth.onAuthStateChanged(() => {
  isAuthReady = true;
  router.isReady().then(() => {
    router.push('/')
  });
});

router.beforeEach((to, from, next) => {
  if (!isAuthReady) {
    next(false);
    return;
  }

  const isLoggedIn = !!auth.currentUser;

  if (to.meta.requiresUnauth && isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router
