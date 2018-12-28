import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const components = {
  login: () => import('@/views/login'),
  index: () => import('@/views/index'),
  allpage: () => import('@/views/allpage'),
  about: () => import('@/views/about'),
  seaver: () => import('@/views/seaver'),
  phone: () => import('@/views/phone'),
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: components.login
    },
    {
      path: '/',
      name: 'allpage',
      component: components.allpage,
      redirect: '/1',
      children: [
        {
          path: '1',
          name: 'index',
          component: components.index,
        },
        {
          path: '2',
          name: 'about',
          component: components.about,
        },
        {
          path: '3',
          name: 'seaver',
          component: components.seaver,
        },
        {
          path: 'phone',
          name: 'phone',
          component: components.phone,
        },
      ]
    }
  ]
})
