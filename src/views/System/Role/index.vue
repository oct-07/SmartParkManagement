<script>
import { getRoleListAPI, getPermissionTreeAPI, getRoleDetailAPI, getRoleUserAPI, deleteRoleAPI } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      roleList: [],
      activeIndex: 0,
      treeList: [],
      defaultProps: {
        disabled: function() {
          return true
        },
        label: 'title',
        activeName: ''
      },
      params: {
        pageSize: 2,
        page: 1
      },
      total: 0,
      userList: []
    }
  },
  async created() {
    // 这两个方法是异步,所以menuChange会报错roleId未定义,加await就会内部同步
    await this.getRoleList()
    await this.getPermissionTree()

    this.menuChange(0)
  },
  methods: {
    // 删除角色
    deleteRole(id) {
      this.$confirm('你确定要删除吗', '温馨提示').then(async() => {
        await deleteRoleAPI(id)
        this.$message.success('删除成功')
        this.getRoleList()
      }).catch(() => {

      })
    },
    // 获取菜单角色对应权限列表
    async  getRoleUserList(id) {
      const res = await getRoleUserAPI(id)
      console.log('角色成员')
      console.log(res)
      this.total = res.data.total
      this.userList = res.data.rows
    },
    // 权限树状复选框禁用
    // 1.递归添加disable
    // addDisable(treeList) {
    //   treeList.forEach(item => {
    //     item.disabled = true
    //     // 下一级也要调用
    //     if (item.children) {
    //       this.addDisable(item.children)
    //     }
    //   })
    // },
    // 查询所有功能权限树状
    async getPermissionTree() {
      const res = await getPermissionTreeAPI()
      console.log('查看权限树状')
      console.log(res)
      this.treeList = res.data
      // this.addDisable(this.treeList)
    },
    // 点击菜单高亮
    async menuChange(index) {
      // 将点击的高亮索引收集起来
      this.activeIndex = index
      // 拿到的index就是数组roleList的index
      const id = this.roleList[index].roleId

      // 获取菜单角色对应权限列表
      const res = await getRoleDetailAPI(id)
      console.log('角色详情')
      console.log(res)

      // 获取菜单角色对应成员列表
      this.getRoleUserList(id, this.params)

      // 树状权限回显
      // el-tree包裹在v-for里面，循环了5个，有5个组件
      const treeComponentsList = this.$refs.tree
      // treeComponentsList数组
      // [VueComponent, VueComponent, VueComponent, VueComponent, VueComponent]
      console.log(treeComponentsList)
      // 回显的权限数组
      const perms = res.data.perms
      console.log('打印pems')
      console.log(perms)
      console.log('获取tree')

      treeComponentsList.forEach((tree, index) => {
        tree.setCheckedKeys(perms[index])
      })
    },
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleListAPI()
      console.log(res)
      this.roleList = res.data
    }
  }

}
</script>
<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div v-for="(item,index) in roleList" :key="item.roleId" class="role-item" :class="{active:activeIndex===index}" @click="menuChange(index)">
        <div class="role-info">
          <svg-icon :icon-class="activeIndex===index?'user-active':'user'" class="icon" />
          {{ item.
            roleName }}
        </div>
        <div class="more">
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$router.push(`/sys/addRole?id=${item.roleId}`)">编辑角色</el-dropdown-item>
              <el-dropdown-item @click.native="deleteRole(item.roleId)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/sys/addRole')">添加角色</el-button>
    </div>
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="权限管理" name="permision">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title"> {{ item.title }} </div>
              <el-tree
                ref="tree"
                node-key="id"
                :data="item.children"
                :props="defaultProps"
                :default-expand-all="true"
                show-checkbox
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员(${total})`" name="user">
          <div class="user-wrapper">
            <el-table
              :data="userList"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="250"
                label="序号"
              />
              <el-table-column
                prop="name"
                label="员工姓名"
              />
              <el-table-column
                prop="userName"
                label="登录账号"
              />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding:20px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn{
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper{
      padding:20px;
    }
  }
}
</style>
