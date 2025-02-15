<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <!-- 表单校验 -->
      <!-- 1.el-form :model对应的值是表单对应的收集数据的对象
       2.el-form:rules对应的校验规则→
      3.el-form-item（表单域） prop表示要校验哪个字段
      4.表单元素(el-input、el-checkbox...)v-model 双向绑定，获取输入值 -->
      <el-form ref="form" :model="loginForm" :rules="rules">
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input v-model="loginForm.username" />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="loginForm.password" />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { FORM_KEY } from '@/constants/KEY'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rememberMe: false,
      rules: {
        username: [
          { required: true, message: '输入内容不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '输入内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    const loginData = localStorage.getItem(FORM_KEY)
    if (loginData) {
      const { username, password } = JSON.parse(loginData)
      this.loginForm.username = username
      this.loginForm.password = password
    }
  },
  methods: {
    submitForm(form) {
      console.log('111')
      console.log(this.$refs['form'])
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          await this.$store.dispatch('user/loginActions', this.loginForm)
          // 判断有没有点击记住我
          if (this.rememberMe) {
            console.log('----' + JSON.stringify(this.loginForm))
            localStorage.setItem(FORM_KEY, JSON.stringify(this.loginForm))
          } else {
            localStorage.removeItem(FORM_KEY)
          }
          // 实现那个页面退出，跳转到那个页面
          if (this.$route.query.redirect) {
            console.log('查询页面')
            console.log(this.$route.query.redirect)
            this.$router.push(this.$route.query.redirect)
          } else {
            this.$router.push('/')
          }
        } else {
          console.log('error submit!!')
          return false
        }
        // if (!valid) {
        //   console.log('error submit!!!!')
        //   return false
        // }
      })
    }
  }
}

</script>

<style scoped lang="scss">
  .login_body {
    display: flex;
  }
  .bg {
    width: 60vw;
    height: 100vh;
    background: url('~@/assets/login-bg.svg') no-repeat;
    background-position: right top;
    background-size: cover;
  }
  .box {
    margin: 200px 10% 0;
    flex: 1;
    .title {
      padding-bottom: 76px;
      font-size: 26px;
      font-weight: 500;
      color: #1e2023;
    }
    ::v-deep() {
      .ant-form-item {
        display: flex;
        margin-bottom: 62px;
        flex-direction: column;
      }
      .ant-form-item-label label {
        font-size: 16px;
        color: #8b929d;
      }
      .ant-input,
      .ant-input-password {
        border-radius: 8px;
      }
    }
  }
  .login_btn{
    width: 100%;
  }
</style>
