import router from '@/router'
import store from '@/store'
const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  if (token) {
    // 有token---已经登录了，不能跳转到登录页
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 白名单才可以访问
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

