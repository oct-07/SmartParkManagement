<script>
import { deleteCardAPI, getCardListAPI } from '@/api/card.js'

export default {
  name: 'Card',
  components: {

  },
  data() {
    return {
      params: {
        page: 1,
        pageSize: 2,
        carNumber: '',
        personName: '',
        cardStatus: null
      },
      list: [],
      total: 0,
      statusList: [{
        text: '全部',
        value: null
      }, {
        text: '可用',
        value: '0'

      }, {
        text: '已过期',
        value: '1'
      }],
      batchDeleteList: []
    }
  },

  created() {
    this.getCardList()
    console.log('我初始化啦')
  },
  methods: {

    // 获取月卡列表
    async getCardList() {
      this.params.carNumber = this.params.carNumber.trim()
      this.params.personName = this.params.personName.trim()
      const res = await getCardListAPI(this.params)
      this.list = res.data.rows
      this.total = res.data.total
      console.dir(this.list)
    },
    search() {
      // 查询页码固定在第一页
      this.params.page = 1
      this.getCardList()
    },
    // 格式化数据
    formatStatus(row, column, cellValue, index) {
      const MAP = { 0: '可用', 1: '不可用' }
      return MAP[cellValue]
    },
    // 页码切换
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getCardList()
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getCardList()
      console.log(`当前页: ${val}`)
    },
    // 列表序号
    indexMethod(index) {
      // index 参数会自动传入当前行的索引就是0。
      // 当前页之前所有页的项目总数=（当前页页码-1）*页码容量
      //  当前页的当前行在整个数据集中的序号=项目总数 + index + 1
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    // 编辑月卡
    editorCard(id) {
      this.$router.push({
        path: '/car/monthCard',
        query: {
          id
        }
      })
      console.log(id)
    },
    // 删除月卡
    deleteCard(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteCardAPI(id)
        console.log(res)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 如果删除最后一页，page-
        if (this.data.list === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.getCardList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 批量删除
    batcnDeleteCard() {
      if (this.batchDeleteList.length <= 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      const ids = this.batchDeleteList.map((item) => {
        return item.id
      })
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteCardAPI(ids.join(','))
        console.log(res)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getCardList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 用户选择数据
    handleSelectionChange(val) {
      this.batchDeleteList = val
    }
  }
}

</script>

<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="params.carNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">车主姓名：</span>
      <el-input v-model="params.personName" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus">
        <el-option v-for="item in statusList" :key="item.value" :label="item.text" :value="item.value" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="search">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/car/monthCard')">添加月卡</el-button>
      <el-button @click="batcnDeleteCard">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="list" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column label="状态" prop="cardStatus" :formatter="formatStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editorCard(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteCard(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :current-page="params.page"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加楼宇 -->
    <el-dialog
      title="添加楼宇"
      width="580px"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn{
    margin-left:20px;
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
