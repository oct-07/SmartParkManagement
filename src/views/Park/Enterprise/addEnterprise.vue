<script>
import { getIndustryListAPI, getEnterpriseDetailAPI, addEnterpriseAPI, updateExterpriseAPI } from '@/api/enterprise'
import { uploadFileAPI } from '@/api/common.js'

export default {
  data() {
    return {
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      list: [],
      rules: {
        name: [
          { required: true, message: '企业名称必填', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '法人必填', trigger: 'blur' }
        ],
        registeredAddress: [
          { required: true, trigger: 'blur', message: '注册地址必填' }
        ],
        industryCode: [
          { required: true, trigger: 'change', message: '所在行业必填' }
        ],
        contact: [
          { required: true, trigger: 'blur', message: '企业联系人必填' }
        ],
        contactNumber: [
          { required: true, trigger: 'blur', message: '联系人电话必填' }
        ],
        businessLicenseUrl: [
          { required: true, trigger: 'blur', message: '请上传营业执照' }
        ]

      }
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  created() {
    this.getIndustryList()
    if (this.id) {
      this.getEnterpriseDetail()
    }
  },
  methods: {
    // 获取企业所属行业
    async getIndustryList() {
      const res = await getIndustryListAPI()
      console.log(res)
      this.list = res.data
      console.log(this.list)
    },

    // 上传图片

    async uploadImage({ file }) {
      console.log(file)
      const formData = new FormData()
      // 追加用append
      formData.append('file', file)
      formData.append('type', 1)
      console.log(formData.file)

      // 调用方法
      const res = await uploadFileAPI(formData)
      console.log(res)
      this.addForm.businessLicenseUrl = res.data.url
      this.addForm.businessLicenseId = res.data.id
      this.$refs.ruleForm.validateField('businessLicenseUrl')
    },
    // 上传图片格式进行验证
    beforeUpload(file) {
      const imagUrl = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
      const fileSize = file.size / 1024 / 1024 < 5
      if (!imagUrl) {
        this.$message.error('上传合同图片只能是 PNG/JPG/JPEG 格式!')
        return
      }
      if (!fileSize) {
        this.$message.error('上传合同图片大小不能超过 5MB!')
        return
      }
    },
    // 表单验证添加编辑企业
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        if (this.id) {
          delete this.addForm.businessLicenseName
          delete this.addForm.rent
          delete this.addForm.industryName
          // 编辑
          await updateExterpriseAPI(this.addForm)
          this.$message.success('编辑成功')
          console.log('编辑')
        } else {
          // 新增
          await addEnterpriseAPI(this.addForm)
          this.$message.success('添加成功')
        }
        this.$router.back()
      })
    },
    // 编辑企业数据回显
    async getEnterpriseDetail() {
      const res = await getEnterpriseDetailAPI(this.id)
      console.log('回显数据')
      console.log(res)
      const { businessLicenseId, businessLicenseUrl, contact, contactNumber, industryCode, legalPerson, name, registeredAddress, id } = res.data
      this.addForm = { businessLicenseId, businessLicenseUrl, contact, contactNumber, industryCode, legalPerson, name, registeredAddress, id }
    }
  }

}

</script>

<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ id ? "编辑企业":"添加企业" }}</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form ref="ruleForm" label-width="100px" :model="addForm" :rules="rules">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in list"
                  :key="item.industryCode"
                  :label="item.industryName"
                  :value="item.industryCode"
                />
              </el-select></el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseUrl">
              <el-upload
                action="#"
                :http-request="uploadImage"
                :before-upload="beforeUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
              <img v-if="id" :src="addForm.businessLicenseUrl" style="width:100px;">
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button>重置</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.add-enterprise {
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
      .arrow{
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left:20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form{
          display: flex;
          flex-wrap: wrap;
          .el-form-item{
            width: 50%;
          }
        }
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
  }
}
</style>
