import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import NotFoundPage from '@/views/NotFoundPage.vue'
import consoleRoute from '@/router/console'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/:pathMatch(.*)*', component: NotFoundPage, name: 'not_found' },
        { path: '/offline', component: () => import('@/views/OfflinePage.vue'), name: 'offline' },
        ...consoleRoute
    ]
})

/* Middleware */
router.beforeEach(async (to, from, next) => {
    var useStore = useAuthStore()
    var localStorageToken = useStore.token

    // Set axios header if user is authenticated
    if (useStore.token !== null) {
        window.axios.defaults.headers.common["Authorization"] = 'Bearer ' + useStore.token
    }

    if (to.meta.auth == true && localStorageToken == undefined) {
        useStore.removeAuth()
        next({ name: 'login' })
    } else if (to.meta.auth == false && localStorageToken != undefined) {
        if (useStore.userProfile.user_type == ConstantHelper.userType.hq) {
            next({ name: 'backoffice:home' }) // Platform owner home page
        } else {
            next({ name: 'console_home' }) // Client home page
        }
    } else {
        if (to.meta.userType && to.meta.userType != useStore.userProfile?.user_type) {
            next({ name: 'login' })
        } else {
            next()
        }
    }
})

export default router
