import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'
import getPageTitle from '@/util/get-page-title'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: {title: 'Dashboard', icon: 'dashboard'}
      }
    ]
  },
  {
    path: '/app',
    name: 'App',
    redirect: '/app/model',
    component: Layout,
    meta: {title: '应用管理', icon: 'el-icon-menu'},
    children: [
      {
        path: 'model',
        name: 'Model',
        component: () => import('@/views/app/model'),
        meta: {title: '模型管理', icon: 'model-manager'}
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/app/user'),
        meta: {title: '用户管理', icon: 'el-icon-user-solid'}
      },
      {
        path: 'pic',
        name: 'Pic',
        component: () => import('@/views/app/pic'),
        meta: {title: '图片管理', icon: 'el-icon-picture'}
      },
      {
        path: 'task',
        name: 'Task',
        component: () => import('@/views/app/task'),
        meta: {title: '任务管理', icon: 'task'}
      },
      {
        path: 'pointRecord',
        name: 'PointRecord',
        component: () => import('@/views/app/pointRecord'),
        meta: {title: '积分流水', icon: 'point'}
      },
      {
        path: 'share',
        name: 'Share',
        component: () => import('@/views/app/share'),
        meta: {title: '投稿审核', icon: 'audit'}
      },
    ]
  },
  {
    path: '/log',
    name: 'Log',
    redirect: '/log/request',
    component: Layout,
    meta: {title: '日志管理', icon: 'el-icon-document'},
    children: [
      {
        path: 'request',
        name: 'Request',
        component: () => import('@/views/log/request'),
        meta: {title: '请求日志', icon: 'el-icon-data-line'}
      },
      {
        path: 'requestLimit',
        name: 'RequestLimit',
        component: () => import('@/views/log/requestLimit'),
        meta: {title: '请求限制', icon: 'el-icon-document-delete'}
      },
    ]
  },
  {
    path: '/system',
    name: 'System',
    redirect: '/system/client',
    component: Layout,
    meta: {title: '系统管理', icon: 'el-icon-s-tools'},
    children: [
      {
        path: 'client',
        name: 'Client',
        component: () => import('@/views/system/client'),
        meta: {title: '客户端管理', icon: 'el-icon-s-platform'}
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('@/views/system/permission'),
        meta: {title: '权限管理', icon: 'el-icon-s-promotion'}
      },
      {
        path: 'mirai',
        name: 'Mirai',
        component: () => import('@/views/system/mirai'),
        meta: {title: 'QQ机器人', icon: 'qq'}
      },
    ]
  },

  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.path !== '/login') {
    if (!localStorage['access_token']) return next("/login")
  }
  document.title = getPageTitle(to.meta.title)
  next()
})

export default router
