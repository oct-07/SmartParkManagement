<script>
import { getPermissionTreeAPI, addRoleAPI, getRoleDetailAPI, editRoleAPI } from '@/api/role'
export default {
  data() {
    return {
      stepActive: 1,
      roleForm: {
        roleName: '',
        remark: '',
        perms: []
      },
      treeList: [],
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入描述名称', trigger: 'blur' }
        ]
      },
      defaultProps: {
        label: 'title'
      }

    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  created() {
    this.getPermissionTree()
    if (this.id) {
      this.getRoleList()
    }
  },
  methods: {
    // 获取角色数据回显
    async getRoleList() {
      const res = await getRoleDetailAPI(this.id)
      console.log('角色回显')
      console.log(res)
      this.roleForm = res.data
    },
    // 编辑、添加角色
    async submit() {
      if (this.id) {
        delete this.roleForm.userTotal
        await editRoleAPI(this.roleForm)
        this.$message.success('编辑成功')
      } else {
        await addRoleAPI(this.roleForm)
        this.$message.success('添加成功')
      }
      this.$router.back()
    },
    // 查询所有功能权限树状
    async getPermissionTree() {
      const res = await getPermissionTreeAPI()
      console.log('查看权限树状')
      console.log(res)
      this.treeList = res.data
      // this.addDisable(this.treeList)
    },
    // 上一步
    prev() {
      if (this.stepActive > 0) { this.stepActive-- }
    },
    // 下一步
    next() {
      if (this.stepActive <= 3) {
      // 第一步权限控制
        if (this.stepActive === 1) {
          this.$refs.roleRef.validate((val) => {
            if (val) this.stepActive++
          })
          // 第二步权限控制
        } else if (this.stepActive === 2) {
          // 判断有没有勾选
          const componentList = this.$refs.tree
          console.log(componentList)
          console.log('勾选')
          // 点击下一步之前要清空perms中之前选的数据
          this.roleForm.perms = []
          componentList.forEach((tree) => {
            this.roleForm.perms.push(tree.getCheckedKeys())
            console.log('perms')
            console.log(this.roleForm.perms)
          })
          // 判断有没有选值，能不能走下一步
          // flat()二维数组展开成一维数组
          if (this.roleForm.perms.flat().length <= 0) {
            this.$message.warning('你还没有选择权限')
            return
          }
          // 进入第三步前，先数据回显，这样进入第三部界面就不会闪一下
          const disabledTreeList = this.$refs.disabledTree
          disabledTreeList.forEach((tree, index) => {
            tree.setCheckedKeys(this.roleForm.perms[index])
            console.log('回显啊')
          })
          this.stepActive++
        }
      }
    }

  }
}
</script>
<template>
  <div class="add-role">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ id?'编辑角色':'添加角色' }}</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="stepActive">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <div v-show="stepActive===1" class="form-container">
        <div class="form">
          <el-form ref="roleRef" class="form-box" :model="roleForm" :rules="roleRules">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述" prop="remark">
              <el-input v-model="roleForm.remark" />
            </el-form-item>
          </el-form>
        </div>

      </div>
      <div v-show="stepActive===2" class="form-container">
        <div v-for="item in treeList" :key="item.id" class="tree-item">
          <div class="tree-title"> {{ item.title }} </div>
          <el-tree
            ref="tree"
            :data="item.children"
            :props="defaultProps"
            :default-expand-all="true"
            show-checkbox
            check-strictly
            node-key="id"
          />
        </div>
      </div>
      <div v-show="stepActive===3" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in treeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="disabledTree"
                  :data="item.children"
                  show-checkbox
                  check-strictly
                  default-expand-all
                  node-key="id"
                  :props="{ label: 'title',disabled:()=>true}"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button v-show="stepActive!==1" @click="prev">上一步</el-button>
        <el-button v-show="stepActive!==3" type="primary" @click="next">下一步</el-button>
        <el-button v-show="stepActive===3" type="primary" @click="submit">确认提交</el-button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.add-role {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;
    .step-container {
      height: 400px;
      width: 200px;
    }
    .form-container {
      display: flex;
      flex:1;
      background-color: #fff;
      overflow-y: auto;
      .title {

        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form {
          display: flex;
          flex-wrap: wrap;
        }
        .info{
          font-size:14px;
          color:#666;
          .form-item{
            margin-bottom:20px;
          }
        }
      }
      .form-box{
        width: 600px;
        display: flex;
        flex-direction: column;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
    z-index: 10001;
  }
  .tree-wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .tree-item {
        flex: 1;
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
}
</style>
