import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/workbench'
  },
  {
    path: '/car/monthCard',
    component: () => import('@/views/Car/CarCard/addmonthcard.vue')

  },
  {
    path: '/addEnterprise',
    component: () => import('@/views/Park/Enterprise/addEnterprise.vue')

  },
  {
    path: '/enterpriseDetail/:id',
    component: () => import('@/views/Park/Enterprise/EnterpriseDetail.vue')

  },
  {
    path: '/workbench',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/Workbench/index'),
      meta: { title: '工作台', icon: 'el-icon-data-board' }
    }]
  },

  {
    path: '/sys/addRole',
    component: () => import('@/views/System/Role/components/AddRole.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

// 创建vue实例
const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'hash',
  // 切换的时候处于顶端
  scrollBehavior: () => ({ y: 0 }),
  //  路由配置规则
  routes: routes
})

// 调用封装的方法，直接创建路由实例
const router = createRouter()

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter()
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher
}

export default router
