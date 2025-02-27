// 导入vue构造函数
import Vue from 'vue'
// 清除浏览器默认样式
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
// 引入App根组件
import App from './App'
// 引入vuex
import store from './store'
// 引入vue-router
import router from './router'

// 导入路由前置守卫
// import除了导入某个成员之外还可以执行导入的文件
import './permission'
// 注册svg
import '@/icons'
// 导入自定义指令
import '@/directive'

// 导入微前端
import './registerMicroApp'

// vue插件，把element-ui中导出的所有组件注册成全局组件
Vue.use(ElementUI)

// 上线之后，有警告是否需要显示
Vue.config.productionTip = false

// vue实例化
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
