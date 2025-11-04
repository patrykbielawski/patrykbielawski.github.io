import { createRouter, createWebHashHistory, } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { getFirebaseAuth } from '@/firebase';

import HomeView from '../views/HomeView.vue';
import AuthView from '../views/AuthView.vue';
import UserProfile from '../views/UserProfile.vue';
import SearchResults from '../views/SearchResults.vue';
import RecipeDetails from '../views/RecipeDetails.vue';
import SubmitRecipe from '../views/SubmitRecipe.vue';
import ContactView from '../views/ContactView.vue';
import ShoppingList from '../views/ShoppingList.vue';


export default function createCooksyRouter() {
  const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: {
        title: 'Homepage',
      }
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
      path: '/profile', 
      name: 'UserProfileRedirect',
      meta: {
        requiresAuth: true,
      },
      redirect: (to) => {
        const user = auth.currentUser;

        if (user) {
          return { name: 'UserProfile', params: { id: user.uid } };
        }
        return '/';
      } 
    },

    {
      path: '/user/:id',
      name: 'UserProfile',
      component: UserProfile,
      meta: {
        title: 'Profile',
        requiresAuth: true
      }
    },

    {
      path: '/search/',
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

    {
      path: '/submit',
      name: 'SubmitRecipe',
      component: SubmitRecipe,
      meta: {
        title: 'Submit your own recipe',
        requiresAuth: true
      }
    },

    {
      path: '/contact',
      name: 'Contact',
      component: ContactView,
      meta: {
        title: 'Contact Page',
      }
    },

    {
      path: '/list',
      name: 'ShoppingList',
      component: ShoppingList,
      meta: {
        title: 'Shopping List',
      }
    },
  ]

  const auth = getFirebaseAuth();

  const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
      return { top: 0 };
    }
  })

  let isAuthReady = false;

  auth.onAuthStateChanged(() => {
    if (!isAuthReady) {
      isAuthReady = true;
    }
  });

  router.beforeEach((to, from, next) => {

    if (!isAuthReady) {
      const unsubscribe = auth.onAuthStateChanged(() => {
        unsubscribe();
        next({ ...to, replace: true });
      });
      return;
    }

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresUnauth = to.matched.some(record => record.meta.requiresUnauth);
    const user = auth.currentUser;

    if (requiresAuth && !user) {
      next({ name: 'Auth' });
    } else if (requiresUnauth && user) {
      next({ name: 'Home' });
    } else {
      next();
    }

    if (to.name === 'UserProfileRedirect' && requiresAuth) {
      if (user) {
        next({ name: 'UserProfile', params: { id: user.uid } });
        return;
      } else {
        next({ name: 'Auth' });
        return;
      }
    }

    if (requiresAuth && !user) {
      next({ name: 'Auth' });
      return;
    }

    if (requiresUnauth && user) {
      next({ name: 'Home' });
      return;
    }

  });

  return router;
}

