<script>
import { getEnterpriseListAPI, delelteEnterpriseAPI, getBuildingListAPI, addRentContactAPI, getEnterpriseRentListAPI } from '@/api/enterprise'
import { uploadFileAPI } from '@/api/common'

export default {
  data() {
    return {
      params: {
        page: 1,
        pageSize: 2
      },
      enterpriseList: [],
      total: 0,
      dialogVisible: false,
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间,
      },
      rentBuildingList: [
        { id: null, name: '' }
      ],

      rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getEnterpriseList()
    console.log('获取企业列表数据')
  },

  methods: {
    // tag颜色
    formateTage(status) {
      const tagMap = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      return tagMap[status]
    },
    // 格式化状态
    formateStatus(status) {
      const Map = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      console.log('状态')
      console.log(status)
      return Map[status]
    },
    // 展开或关闭触发expandChange事件
    // row当前行的数据是一个对象，expandedRows数组存放row对象
    async expandChange(row, expandedRows) {
      console.log(row, expandedRows)
      // 现在只需要展开时显示数据，判断row对象在不在expandedRows数组中
      const includes = expandedRows.find((item) => item.id === row.id)
      if (!includes) return
      const res = await getEnterpriseRentListAPI(row.id)
      // eslint-disable-next-line require-atomic-updates
      row.rentList = res.data
      console.log(row.rentList)
      console.log('存进去了')
    },
    // 移除合同文件
    onRemove(file) {
      // 清空表单字段
      this.rentForm.contractId = ''
      this.rentForm.contractUrl = ''
      // 触发校验
      this.$refs.addForm.validateField('contractId')
    },
    // 确定添加合同
    addContact() {
      // 最后的统一校验
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          // 请求数据处理
          const rentData = {
            ...this.rentForm,
            startTime: this.rentForm.rentTime[0],
            endTime: this.rentForm.rentTime[1]
          }
          delete rentData.rentTime
          console.log('看看上传的参数')
          console.log(rentData)
          await addRentContactAPI(rentData)
          this.$message.success('添加合同成功')
          // 关闭弹框清除数据
          this.closeDialog()
        }
      })
    },
    // 上传文件最大数量限制提醒
    onExceed() {
      this.$message.warning('文件超出最大限制')
    },
    // 上传合同前校验
    beforeUpload(file) {
      console.log('校验开始 ')
      // 1.文件类型校验
      const typeList = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/pdf']
      // 2.文件大小校验
      const fileType = typeList.includes(file.type)
      const size = file.size / 1024 / 1024 < 5
      if (fileType && size) {
        console.log('校验成功')
        return true
      } else {
        this.$message.warning('上传文件不符合要求，请重新上传')
        console.log('校验失败')
        return false
      }
    },

    // 上传合同
    async httpRequest({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 1)

      try {
        const res = await uploadFileAPI(formData)
        this.rentForm.contractId = res.data.id
        this.rentForm.contractUrl = res.data.url
        // this.rentForm.contractName = res.data.name
        // 触发表单校验更新 validateField
        this.$refs.addForm.validateField('contractId')
      } catch (error) {
        this.$message.error('上传失败')
      }
    },
    // 添加合同
    async addRent(id) {
      this.dialogVisible = true
      // 收集点击的哪一行
      this.rentForm.enterpriseId = id
      const res = await getBuildingListAPI()
      this.rentBuildingList = res.data
      console.log('添加合同按钮触发')
      console.log(res)
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
      // 清除提醒
      this.$refs.addForm.resetFields()
      // 清除表单内容
      this.rentForm = {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间,
      }
      // 清除上传的文件
      this.$refs.upload.clearFiles()
    },
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

    // 获取企业列表
    async getEnterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      console.log(res)
      // 给列表中每一个数据添加额外属性
      this.enterpriseList = res.data.rows.map(item => {
        return { ...item,
          rentList: [] }
      })
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
      <el-button type="primary" @click="$router.push('/addEnterprise')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="enterpriseList"
        @expand-change="expandChange"
      >
        <el-table-column type="expand">
          <template #default="scope">
            <el-table :data="scope.row.rentList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime">
                <template #default="rentObj">{{ rentObj.row.startTime }}至{{ rentObj.row.endTime }}</template>
              </el-table-column>
              <el-table-column label="合同状态" prop="status">
                <template #default="rentObj"> <el-tag :type="formateTage(rentObj.row.status)"> {{ formateStatus(rentObj.row.status) }}</el-tag></template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button size="mini" type="text">退租</el-button>
                  <el-button size="mini" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" @click="addRent(scope.row.id)">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editorForm(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteEnterprise(scope.row.id)">删除</el-button>
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
    <el-dialog
      title="添加合同"
      :visible="dialogVisible"
      width="580px"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <div class="form-container">
        <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in rentBuildingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload
              ref="upload"
              action="#"
              :http-request="httpRequest"
              :before-upload="beforeUpload"
              :limit="1"
              :on-exceed="onExceed"
              :on-remove="onRemove"
            >
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addContact">确 定</el-button>
      </template>
    </el-dialog>
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
