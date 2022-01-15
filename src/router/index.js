import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/Index'
import Enter from '@/views/Enter'
import User from '@/views/User'
import NotFound from '@/views/NotFound'
import store from '@/store'
import { auth } from '@/utils/userUtils'
import Register from '@/views/Register'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/enter',
    name: 'Enter',
    component: Enter,
    meta: { auth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { auth: false }
  },
  {
    path: '/user/:login',
    name: 'User',
    component: User
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const jwt = localStorage.getItem('jwt')
  if (jwt && !store.getters.isAuth) {
    await auth(jwt)
  }
  if (to.meta.auth === undefined) {
    return true
  }
  if (to.meta.auth && !store.state.user) {
    return { name: 'Enter' }
  }
  if (!to.meta.auth && store.state.user) {
    return { name: 'Index' }
  }
})

export default router
