<template>
  <div>
    <div class="header-page">
      <div>
        <svg-icon icon-class="ding"></svg-icon>
        <span>北京</span>
      </div>
      <div>
        <span>我的购物车 | </span>
        <span>我的订单 | </span>
        <el-popover
          placement="bottom"
          width="200"
          trigger="click">
          <el-button type="text" @click="editUserInfo">修改用户信息</el-button>
          <i class="el-icon-setting" slot="reference" style="margin-right: 15px"></i>
        </el-popover>
        <img :src="userImg" alt="">
        <span>{{userName}}</span>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="closeDialog">
      <el-form :model="userForm" :show-message="false" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户昵称" required prop="userName">
          <el-input v-model="userForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="loginName" required>
          <el-input v-model="userForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="用户头像" required>
          <el-upload
            action="#"
            list-type="picture-card"
            :file-list="fileList"
            :on-change="fileChange"
            :auto-upload="false">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" required>
          <el-input v-model.number="userForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address" required>
          <el-input v-model="userForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
    <div class="main-page">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import "../assets/icons/svg/ding.svg"
import { getBase64 } from '@/utils/index'
export default {
  data() {
    return {
      userForm: {},
      rules: {},
      dialogVisible: false,
      disabled: false,
      fileList: [],
      userImgIn: ''
    }
  },
  async created() {
    this.$store.dispatch('setUserId', this.$store.state.userId)
  },
  computed: {
    userName () {
      return this.$store.state.userData?.userName || '未登录'
    },
    userImg() {
      return this.$store.state.userData?.userImg || ''
    },
    userData() {
      return this.$store.state.userData || {}
    }
  },
  methods: {
    editUserInfo() {
      this.dialogVisible = true
      this.userForm = JSON.parse(JSON.stringify(this.userData))
      this.userImgIn = this.userData.userImg,
      this.fileList = [{
        name: 'name',
        url: this.userForm.userImg
      }]
    },
    closeDialog() {
      this.$refs['ruleForm'].resetFields();
      this.fileList = []
      this.dialogVisible = false
    },
    editGoods() {
      let params = this.userForm
      params.userImg = this.userImgIn
      params.userId = this.$store.state.userData?.userId || ''
      console.log(params)
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: '/changeUserInfo',
            method: 'post',
            data: params
          }).then(res => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.$store.dispatch('setUserId', this.$store.state.userId)
              this.dialogVisible = false
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg || 'error'
              })
            }
          })
        } else {
          this.$message({
            type: 'wraning',
            message: '请填写必填项'
          })
          return false
        }
      })
      
      
    },
    fileChange(file) {
      console.log(file)
      this.fileList = [file]
      getBase64(file.raw).then(res => {
        this.userImgIn = res
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.header-page {
  padding: 0 10%;
  height: 40px;
  background: #eee;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
  img {
    width: 20px;
    height: 20px;
  }
}
.main-page {
  // padding: 0 10%;
  width: 1190px;
  margin: 20px auto;
}
.shop-list-box {
  flex-direction: column;
}
</style>