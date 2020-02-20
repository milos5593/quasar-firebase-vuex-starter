import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({ store }) {
    const Router = new VueRouter({
        scrollBehavior: () => ({ x: 0, y: 0 }),
        routes,

        // Leave these as they are and change in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        mode: process.env.VUE_ROUTER_MODE,
        base: process.env.VUE_ROUTER_BASE
    })

    Router.beforeEach((to, from, next) => {
        const { authorize } = to.meta;
        const currentUser = store.getters['auth/GET_USER_INFO'];
        const role = store.getters['auth/GET_ROLE'];
        
        // If logged in and trying to go to login redirect back
        if (currentUser && to.fullPath === '/auth/login') {
            return next({
                path: from.path
            });
        }

        if (authorize) {
            if (!currentUser) {
                // not logged in so redirect to login page with the return url
                return next({ name: 'login', query: { returnUrl: from.path } });
            }

            // check if route is restricted by role
            if (authorize.length && !authorize.includes(role)) {
                // role not authorised so redirect to home page
                return next({ name: 'home' });
            }
        }

        next();
    });

  return Router
}
