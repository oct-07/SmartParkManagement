<script>
import { getRoleListAPI, getPermissionTreeAPI } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      roleList: [],
      activeIndex: 0,
      treeList: [],
      defaultProps: {

        label: 'title'
      }

    }
  },
  created() {
    this.getRoleList()
    this.getPermissionTree()
  },
  methods: {
    // 查询所有功能权限树状
    async getPermissionTree() {
      const res = await getPermissionTreeAPI()
      console.log(res)
      this.treeList = res.data
    },
    // 点击菜单高亮
    menuChange(index) {
      // 将点击的高亮索引收集起来
      this.activeIndex = index
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
          <svg-icon icon-class="more" />
        </div>
      </div>
      <el-button class="addBtn" size="mini">添加角色</el-button>
    </div>
    <div class="right-wrapper">
      <div class="tree-wrapper">
        <div v-for="item in treeList" :key="item.id" class="tree-item">
          <div class="tree-title"> {{ item.title }} </div>
          <el-tree
            :data="item.children"
            :props="defaultProps"
            :default-expand-all="true"
            show-checkbox
          />
        </div>
      </div>
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
