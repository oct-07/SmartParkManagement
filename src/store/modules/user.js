import { loginAPI } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
// 子模块
export default {
  // 命名kongjian
  namespaced: true,
  state: {
    token: getToken() || ''
  },
  // mutations中的方法只有一种调用方式store.commite('mutations中的方法名')并没有方法名（）这种调用方式
  mutations: {
    setToken(state, newToken) {
      state.token = newToken
      // token存到cookie中
      setToken(newToken)
      console.log('token存进来了')
    },
    removeToken(state) {
      // 清除vuex中的token
      state.token = ''
      // 清除cookie中的token
      removeToken()
    }
  },
  actions: {
    async loginActions(context, data) {
      const res = await loginAPI(data)
      console.log(res)
      context.commit('setToken', res.data.token)
    }
  }

}
