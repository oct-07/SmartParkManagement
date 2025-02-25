<script>
import { getEnterpriseListAPI, delelteEnterpriseAPI } from '@/api/enterprise'

export default {
  data() {
    return {
      params: {
        name: '',
        page: 1,
        pageSize: 2
      },
      enterpriseList: [],
      total: 0
    }
  },
  created() {
    this.getEnterpriseList()
    console.log('获取企业列表数据')
  },

  methods: {
    // 删除企业
    deleteEnterprise(id) {
      this.$confirm('你确定要删除吗', '温馨提示').then(async() => {
        await delelteEnterpriseAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        if (!this.list.length === 1 && this.params.page < 1) {
          this.params.page--
        }
        this.getEnterpriseList()
      }).catch(() => {

      })
    },
    async getEnterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      console.log(res)
      this.enterpriseList = res.data.rows
      this.total = res.data.total
    },
    // 获取用户点击的当前页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.params.page = val
      this.getEnterpriseList()
    },
    // 列表序号
    indexMethod(index) {
      // index 参数会自动传入当前行的索引就是0。
      // 当前页之前所有页的项目总数=（当前页页码-1）*页码容量
      //  当前页的当前行在整个数据集中的序号=项目总数 + index + 1
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    // 搜索时，页面重置第一页再请求数据查询
    search() {
      this.params.page = 1
      this.getEnterpriseList()
    },
    // 编辑表单
    editorForm(id) {
      this.$router.push({
        path: '/addEnterprise', query: { id }
      })
    }

  }
}
</script>
<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="search" />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="create-container">
      <el-button v-permission="'park:enterprise:add_edit'" type="primary" @click="$router.push('/addEnterprise')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="enterpriseList"
      >
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-permission="'park:rent:add_surrender'" size="mini" type="text">添加合同</el-button>
            <el-button v-permission="'park:enterprise:query'" size="mini" type="text">查看</el-button>
            <el-button v-permission="'park:enterprise:add_edit'" size="mini" type="text" @click="editorForm(scope.row.id)">编辑</el-button>
            <el-button v-permission="'park:enterprise:remove'" size="mini" type="text" @click="deleteEnterprise(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :page-size="params.pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}
</style>
