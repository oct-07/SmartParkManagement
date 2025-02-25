import { getProfileAPI } from '@/api/user'
import { routes, resetRouter } from '@/router'
export default {
  namespaced: true,
  state: {
    // 权限标识
    permissions: [],
    // 路由规则
    routeList: []
  },
  mutations: {
    // 修改权限标识
    setPermission(state, newPermission) {
      state.permissions = newPermission
    },
    // 修改路由规则
    setRouteList(state, asyncRoutes) {
      state.routeList = [...routes, ...asyncRoutes]
      console.log('存进来了吗')
      console.log(state.routeList)
    },
    // 清空路由规则
    clearRoutes(state) {
      state.routeList = []
      resetRouter()
    }
  },
  getters: {},
  actions: {
    async getUserPermission(store) {
      const res = await getProfileAPI()
      store.commit('setPermission', res.data.permissions)
      console.log('打印我的权限啦')
      console.log(res)
      // 权限返回出去
      return res.data.permissions
    }
  }
}
