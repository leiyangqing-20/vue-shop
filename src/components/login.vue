<template>
  <div class="login-page">
    <div class="login-main">
      <el-card>
        <h1>欢迎来到本系统</h1>
        <el-form :model="form" ref="ruleForm" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model.number="form.loginName"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="form.loginPwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
            <el-button class="regeist" type="text" @click="regeistForm()">没有账号？去注册</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {}
    }
  },
  methods: {
    submitForm() {
      console.log('提交', this.form)
      this.$http({
        url: '/loginIn',
        method: 'post',
        data: {
          loginName: this.form.loginName,
          loginPwd: this.form.loginPwd
        }
      }).then(async res => {
        if (res.error === 0 && res.data.canLogin) {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.$store.commit('Set_userID', res.data.userId)
          if (res.data.isSuper) {
            this.$router.push('/admin/list')
          } else {
            this.$router.push('/shop/home')
          }
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    },
    resetForm(formName) {
      console.log('重置')
      this.$refs[formName].resetFields();
    },
    regeistForm() {
      this.$router.push('/regeist')
    }
  }
}
</script>
<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100%;
  position: relative;
  .login-main {
    width: 500px;
    height: 200px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .regeist {
    text-decoration: underline;
  }
}
h1 {
  text-align: center;
}
</style>