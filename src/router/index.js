import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../components/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login', // 登录页面
    name: 'Login',
    component: () => import('../components/login.vue')
  },
  {
    path: '/regeist', // 登录页面
    name: 'Regeist',
    component: () => import('../components/regeist.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Layout,
    redirect: '/admin/list',
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/list.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/admin/user.vue')
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('../views/admin/order.vue')
      },
    ]
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/components/shopLayout.vue'),
    redirect: '/shop/home',
    children: [
      {
        path: 'home', // 首页
        name: 'Home',
        component: () => import('../views/shop/home.vue')
      },
      {
        path: 'detail', // 首页
        name: 'Detail',
        component: () => import('../views/shop/detail.vue')
      },
      {
        path: 'cart', // 首页
        name: 'Cart',
        component: () => import('../views/shop/cart.vue')
      },
      {
        path: 'order', // 首页
        name: 'Order',
        component: () => import('../views/shop/order.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
