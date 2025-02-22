<script>
import { addBillingRuleAPI } from '@/api/carrule'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addForm: {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱

      },

      // 计费规则表单对象
      addFormRules: {
        ruleNumber: [{ required: true, message: '请输入规则编号', trigger: 'blur' }],
        ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        chargeType: [{ required: true, message: '请选择收费类型', trigger: 'blur' }],
        durationTime: [{ required: true, message: '请输入时间', trigger: 'blur' }],
        durationPrice: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        turnPrice: [{ required: true, message: '请输入次数', trigger: 'blur' }],
        partitionFrameTime: [{ required: true, message: '请输入段内时间', trigger: 'blur' }],
        partitionFramePrice: [{ required: true, message: '请输入段内费用', trigger: 'blur' }],
        partitionIncreaseTime: [{ required: true, message: '请输入超出时间', trigger: 'blur' }],
        partitionIncreasePrice: [{ required: true, message: '请输入超出金额', trigger: 'blur' }]
      }
    }
  },
  watch: {
    // 获取选的哪一个单选框
    'addForm.chargeType'(val) {
      console.log(val)
      // 文本框清除所有校验
      this.$refs.addForm.clearValidate(['durationTime', 'durationPrice', 'turnPrice', 'partitionFrameTime', 'partitionFramePrice', 'partitionIncreaseTime', 'partitionIncreasePrice'])
    }
  },
  methods: {
    // 添加计费规则
    submitRule() {
      this.$refs.addForm.validate(async(val) => {
        if (val) {
          const res = await addBillingRuleAPI(this.addForm)
          console.log(res)
          console.log('添加计费')
          this.$message.success('添加成功')

          // 子组件调用父组件方法
          // 1.this.$parent
          // this.$parent.getBillingRule()
          // 2.this.$emit('事件名')
          this.$emit('getBilling')
          this.offDialog()
        }
      })
    },
    // 关闭弹框
    offDialog() {
      // 子组件不能直接修改父组件传过来的数据
      // 1.子传父
      // this.$emit('updatedialogVisible', false)
      // 2.this.$parent
      // this.$parent.dialogVisible = false

      // 3.sync,子组件与父组件的数据进行双向绑定 【父组件加上.sync之后表示放权给子组件修改orops中的数据
      // 固定语法：this.$emit('update:props传过来的值'，要修改的值)
      this.$emit('update:dialogVisible', false)

      this.$refs.addForm.resetFields()
      this.addForm.freeDuration = ''
      this.addForm.chargeCeiling = ''
    }
  }
}

</script>
<template><el-dialog :visible="dialogVisible" width="680px" title="新增规则" :close-on-click-modal="false" @close="offDialog">
  <!-- 表单接口 -->
  <div class="form-container">
    <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-position="top">
      <el-form-item label="计费规则编号" prop="ruleNumber">
        <el-input v-model="addForm.ruleNumber" />
      </el-form-item>
      <el-form-item label="计费规则名称" prop="ruleName">
        <el-input v-model="addForm.ruleName" />
      </el-form-item>
      <el-form-item label="计费方式" prop="chargeType">
        <el-radio-group v-model="addForm.chargeType" size="small">
          <el-radio label="duration" border>时长收费</el-radio>
          <el-radio label="turn" border>按次收费</el-radio>
          <el-radio label="partition" border>分段收费</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="flex-container" style="display:flex;justify-content:space-between">
        <el-form-item label="免费时长">
          <el-input v-model="addForm.freeDuration" />
        </el-form-item>
        <el-form-item label="收费上限">
          <el-input v-model="addForm.chargeCeiling" />
        </el-form-item>
      </div>

      <el-form-item label="计费规则" required>
        <!-- 按时长收费区域 -->
        <div v-if="addForm.chargeType==='duration'" class="duration" style="display:flex">
          每
          <el-form-item prop="durationTime"><el-input v-model="addForm.durationTime" class="input-box" /></el-form-item>
          小时
          <el-form-item prop="durationPrice"><el-input v-model="addForm.durationPrice" class="input-box" /></el-form-item>
          元
        </div>
        <!-- 按次收费区域 -->
        <div v-if="addForm.chargeType==='turn'" class="turn" style="display:flex">
          每次
          <el-form-item prop="turnPrice"> <el-input v-model="addForm.turnPrice" class="input-box" style="width:150px" /></el-form-item>
          元
        </div>
        <!-- 按分段收费区域 -->
        <div v-if="addForm.chargeType==='partition'" class="partition">
          <div class="item" style="display:flex">
            <el-form-item prop="partitionFrameTime"><el-input v-model="addForm.partitionFrameTime" class="input-box" style="width:100px" /></el-form-item>
            小时内,每小时收费
            <el-form-item prop="partitionFramePrice"> <el-input v-model="addForm.partitionFramePrice" class="input-box" style="width:100px" /></el-form-item>
            元
          </div>
          <div class="item" style="display:flex;margin:30px auto 0">
            每增加
            <el-form-item prop="partitionIncreaseTime"><el-input v-model="addForm.partitionIncreaseTime" class="input-box" style="width:120px;" /></el-form-item>
            小时,增加
            <el-form-item prop="partitionIncreasePrice"><el-input v-model="addForm.partitionIncreasePrice" class="input-box" style="width:120px;" /></el-form-item>
            元
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
  <template #footer>
    <el-button size="mini" @click="offDialog">取 消</el-button>
    <el-button size="mini" type="primary" @click="submitRule">确 定</el-button>
  </template>
</el-dialog></template>
<style scoped lang="scss">
.form-container{
  padding:0px 80px;
}
</style>
