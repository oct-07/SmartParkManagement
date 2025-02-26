import router from '@/router'
import store from '@/store'
import { asyncRoutes } from '@/router/asyncRoutes'
const whiteList = ['/login', '/404']
// 筛选一级路由权限信息
function firstFilter(permissions) {
  const firstArr = permissions.map(item => {
    return item.split(':')[0]
  })
  // 去重
  return Array.from(new Set(firstArr))
}
// 筛选二级路由权限信息
function secondFilter(permissions) {
  const secondArr = permissions.map(item => {
    const arr = item.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  // 去重
  return Array.from(new Set(secondArr))
}
// 通过菜单权限过滤一级和二级得到权限菜单列表
function getFilterRoutes(firstPermission, secondPermission, asyncRoutes) {
  // 超级管理员可以看到所有
  if (firstPermission.includes('*')) {
    return asyncRoutes
  }
  // 根据一级和二级对动态路由表做过滤 return出去过滤之后的路由表
  // 1. 根据一级路由对动态路由表做过滤
  return asyncRoutes.filter(route => {
    return firstPermission.includes(route.permissions)
  }).map(item => {
    // 2. 对二级路由做过滤
    return {
      ...item,
      children: item.children.filter(item => secondPermission.includes(item.permission))
    }
  })
}
router.beforeEach(async(to, from, next) => {
  const token = store.state.user.token
  if (token) {
    // 有token---已经登录了，不能跳转到登录页
    if (to.path === '/login') {
      next('/')
    } else {
      next()
      // 1.获取用户权限信息
      const permissions = await store.dispatch('menu/getUserPermission')
      console.log(permissions)
      // 2.筛选一级路由权限信息
      const firstPermission = firstFilter(permissions)
      console.log('一级权限')
      console.log(firstPermission)
      // 3 .筛选二级路由权限信息
      const secondPermission = secondFilter(permissions)
      console.log('二级权限')
      console.log(secondPermission)
      // 4.通过菜单权限过滤一级和二级得到权限菜单列表
      const routes = getFilterRoutes(firstPermission, secondPermission, asyncRoutes)
      console.log('得到筛选完的权限菜单')
      console.log(routes)
      // 5.得到的权限列表渲染在左侧
      // 5.1先把筛选之后的路由添加到路由对象中（跳转）
      routes.forEach(item => router.addRoute(item))
      // 5.2再把筛选之后的路由添加到vuex中（渲染）
      store.commit('menu/setRouteList', routes)
    }
  } else {
    // 白名单才可r以访问
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

