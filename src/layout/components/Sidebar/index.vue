<template>
  <div class="has-logo">
    <logo />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 左侧菜单组件 -->
      <el-menu
        :default-active="activeMenu"
        mode="vertical"
        :collapse-transition="false"
        :unique-opened="true"
      >
        <!-- 菜单中的每一项 -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './Logo'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem, Logo },
  computed: {
    routes() {
      //  this.$router.options.routes获取的是创建路由对象时传入的路由规
      // console.Log(this.$router.options.routes)
      // 左侧菜单的渲染是通过this.$router.options.routes
      // 来进行渲染的
      // 权限标识只需要给this.$router.options.routes进行对比
      // this.$router.options.routes是创建路由对象时传入的路由规则
      // 权限标识跟路由规则进行对比
      // this.$router.options.routes不是响应式的
      // 只能取创建路由对象时传入的路由规则，后续通过addRoute添加的路由是获取不到的
      console.log(this.$router.options.routes)
      // 获取的是创建路由对象时传入的路由规则
      console.log('调用')
      return this.$store.state.menu.routeList
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  }
}
</script>

