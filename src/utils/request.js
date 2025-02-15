import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
// axios.create() 方法用于创建一个自定义的 Axios 实例，返回一个 Axios 实例对象，并将其赋值给 service。
const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1',
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // config携带的就是请求信息，并且return不能省略
    // 这个函数通常配置请求头携带token
    const token = store.state.user.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
// //执行时机：当服务端返回数据的时候。数据流转的第一站就是响应拦截器.
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // token失效拦截
    if (error.response.status === 401) {
      // 清除token
      store.commit('user/removeToken')
      router.push('/login')
      console.dir(error)
    }
    Message.error(error.response.data.msg)
    return Promise.reject(error)
  }
)

export default service
