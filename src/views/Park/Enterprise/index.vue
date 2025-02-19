<script>
import { getEnterpriseListAPI, delelteEnterpriseAPI, getBuildingListAPI, uploadFileAPI, addRentContactAPI } from '@/api/enterprise'

export default {
  data() {
    return {
      params: {
        name: '',
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
    // 移除合同文件
    onRemove() {
      this.rentForm.contractId = ''
      this.rentForm.contractUrl = ''
      this.$refs.addForm.validataFile('contractId')
    },
    // 添加合同
    addContact(addForm) {
      // 最后的统一校验
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          // 请求数据处理
          const rentData = {
            ...this.rentForm,
            starTime: this.rentForm.rentTime[0],
            endTime: this.rentForm.rentTime[1]
          }
          const res = await addRentContactAPI(rentData)
          console.log('添加成功')
          console.log(res)
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
      console.log(file)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 2)
      const res = await uploadFileAPI(formData)
      this.rentForm.contractId = res.data.id
      this.rentForm.contractUrl = res.data.url
      console.log('能打印码')
      console.log(res)
      this.$refs.addForm.validataFile('contractId')
    },
    // 添加合同--查询可租赁楼宇
    async addRent() {
      this.dialogVisible = true
      const res = await getBuildingListAPI()
      this.rentBuildingList = res.data
      console.log('添加合同按钮触发')
      console.log(res)
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
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
      <el-button type="primary" @click="$router.push('/addEnterprise')">添加企业</el-button>
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
            <el-button size="mini" type="text" @click="addRent">添加合同</el-button>
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
