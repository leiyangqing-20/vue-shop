<template>
  <el-form label-width="120px">
    <el-form-item label="登录用户名">
      <el-input v-model="formData.loginName" placeholder="登录用户名"></el-input>
    </el-form-item>
    <el-form-item label="登录密码">
      <el-input type="password" v-model="formData.loginPwd" placeholder="登录密码"></el-input>
    </el-form-item>
    <el-form-item label="再次确认密码">
      <el-input type="password" v-model="formData.agloginPwd" placeholder="再次确认密码"></el-input>
    </el-form-item>
     <el-form-item label="昵称">
      <el-input v-model="formData.userName" placeholder="昵称"></el-input>
    </el-form-item>
     <el-form-item label="手机号">
      <el-input v-model="formData.mobile" placeholder="手机号"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="sureBtn">确 定</el-button>
      <el-button @click="goLogin">去登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      formData: {}
    }
  },
  methods: {
    sureBtn() {
      if (this.formData.agloginPwd !== this.formData.loginPwd) {
        this.$message({
          type: 'error',
          message: '两次输入密码不一致，请重新输入'
        })
        this.formData.agloginPwd = ''
        return
      }
      this.$http({
        url: '/regeist',
        method: 'post',
        data: {
          loginName: this.formData.loginName,
          loginPwd: this.formData.loginPwd,
          userName: this.formData.userName,
          mobile: this.formData.mobile
        }
      }).then(res => {
        if (res.error === 0) {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.$router.push('/login')
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    },
    goLogin() {
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form {
  width: 600px;
  height: 100%;
  margin: 100px auto 0;
}
</style>