// 放置全局指令
import vue from 'vue'
import store from '@/store'
const adminPerms = '*:*:*'
vue.directive('permission', {
  inserted(el, binding) {
    console.log('自定义指令')
    console.log(binding.value)
    // eL:使用自定义指令的D0M元素
    //  binding:对象binding.value可以接受到外部传过来的值
    const pems = store.state.menu.permissions
    console.log('打印pems')
    console.log(pems)
    // 超级管理员账号
    if (pems.includes(adminPerms)) {
      return
    }
    if (!pems.includes(binding.value)) {
      el.remove()
    }
  }
})
