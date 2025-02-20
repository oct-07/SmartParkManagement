<script>
import { getBillingRuleAPI } from '@/api/carrule'
import { utils, writeFileXLSX } from 'xlsx'
export default {
  name: 'Building',
  data() {
    return {
      params: {
        page: 1,
        pageSize: 2
      },
      ruleList: [],
      total: 0
    }
  },
  created() {
    this.getBillingRule()
  },
  methods: {
    // 导出excel
    async exportToExcel() {
      // 限定导出的字段名
      // 表头英文字段key
      const tableHeaderKeys = ['ruleNumber', 'ruleName', 'freeDuration', 'chargeCeiling', 'chargeType', 'ruleNameView']
      const res = await getBillingRuleAPI(this.params)
      console.log('导出excel方法里')
      console.log(res)
      // 以excel表格的顺序调整后端数据
      // 声明新对象接收数据
      const obj = {}
      const list = res.data.rows.map(item => {
        tableHeaderKeys.forEach(key => {
          obj[key] = item[key]
        })
        return obj
      })
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 创建一个工作表 要求一个对象数组格式
      const worksheet = utils.json_to_sheet(
        list
      )
      // 把工作表添加到工作簿  Data为工作表名称
      utils.book_append_sheet(workbook, worksheet, 'Data')

      // 表头中文字段value
      const tableHeaderValues = ['计费规则编号', '计费规则名称', '免费时长(分钟)', '收费上线(元)', '计费方式', '计费规则']
      // 改写表头
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: 'A1' })
      // 导出方法进行导出
      writeFileXLSX(workbook, 'SheetJSVueAoO.xlsx')
    },
    // 序列号
    indexMethod(row) {
      return (this.params.page - 1) * this.params.pageSize + row + 1
    },
    // 分页
    currentChange(val) {
      console.log(val)
      this.params.page = val
      this.getBillingRule()
    },
    async getBillingRule() {
      const res = await getBillingRuleAPI(this.params)
      console.log(this.params)
      console.log(res)
      this.ruleList = res.data.rows
      this.total = res.data.total
    }
  }
}
</script>
<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary">增加停车计费规则</el-button>
      <el-button @click="exportToExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column label="序号" type="index" :index="indexMethod" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上限(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式" prop="chargeType" />
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        :current-page="params.page"
        @current-change="currentChange"
      />
    </div>
  </div>

</template>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
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
</style>
