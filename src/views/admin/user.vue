<template>
  <div class="about">
    <el-card style="margin-top: 28px">
      <el-row>
        <el-button type="text" icon="el-icon-refresh-right" @click="getUsersList">刷新列表</el-button>
        <el-button type="primary" @click="handleaddBtn">新增用户</el-button>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column prop="loginName" label="登录名" width="120">
        </el-table-column>
        <el-table-column label="登陆密码" prop="loginPwd" width="100">
        </el-table-column>
        <el-table-column prop="userImg" label="用户头像">
          <template slot-scope="scope">
            <img :src="scope.row.userImg" alt="" srcset="">
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号">
        </el-table-column>
        <el-table-column prop="isSuper" label="是否是管理员">
          <template slot-scope="scope">
            {{scope.row.isSuper? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row, 'detail')" type="text" size="small">查看</el-button>
            <el-button type="text" size="small" @click="handleClick(scope.row, 'edit')">编辑</el-button>
            <el-button type="text" size="small" @click="deleteGoods(scope.row.userId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="用户信息"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-form :model="ruleForm" :disabled="type==='detail'" :show-message="false" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-form-item label="用户名" required prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="loginName" required>
          <el-input v-model="ruleForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="loginPwd" required>
          <el-input type="password" v-model.number="ruleForm.loginPwd"></el-input>
        </el-form-item>
        <el-form-item label="是否是管理员" prop="isSuper" required>
          <el-radio-group v-model="ruleForm.isSuper">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
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
          <el-input v-model.number="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address" required>
          <el-input v-model="ruleForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getBase64 } from '@/utils/index'
// import { Base64 } from 'js-base64';
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        ruleForm: {},
        rules: {},
        currentPage: 1,
        pageSize: 100,
        dialogVisible: false,
        disabled: false,
        fileList: [],
        userImg: '',
        tableData: [],
        rowdata: {},
        type: ''
      }
    },
    mounted() {
      this.getUsersList()
    },
    methods: {
      handleaddBtn() {
        this.dialogVisible = true
        this.type = 'add'
        this.ruleForm = {}
      },
      addGoods() {
        if (this.type === 'detail') {
          this.closeDialog()
          return
        }
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: '/parent/doUsers',
              method: 'post',
              data: {
                method:	this.type, //edit/add/delete
                userId: this.type === 'add' ? '' : this.rowdata.userId,
                userImg: this.userImg,
                userName: this.ruleForm.userName,
                loginName: this.ruleForm.loginName,
                loginPwd: this.ruleForm.loginPwd,
                mobile: this.ruleForm.mobile,
                address: this.ruleForm.address,
                isSuper: this.ruleForm.isSuper
              }
            }).then(res => {
              if (res.data.status) {
                this.closeDialog()
                this.getUsersList()
                this.$message({
                  type: 'success',
                  message: res.data.msg
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
          } else {
            this.$message({
              type: 'wraning',
              message: '请填写必填项'
            })
            return false;
          }
        });
      },
      deleteGoods(userId) {
        this.$http({
          url: '/parent/doUsers',
          method: 'post',
          data: {
            method:	'delete', //edit/add/delete
            userId: userId,
          }
        }).then(res => {
          if (res.data.status === true) {
            this.getUsersList()
          }
          this.$message({
            type: 'success',
            message: res.data.msg
          })
        })
      },
      closeDialog() {
        this.dialogVisible = false
        this.$refs['ruleForm'].resetFields();
        this.fileList = []
      },
      handleRemove(){},
      handleClick(row, type) {
        this.dialogVisible = true
        this.type = type
        this.rowdata = JSON.parse(JSON.stringify(row))
        this.ruleForm = JSON.parse(JSON.stringify(row))
        this.userImg = row.userImg
        this.fileList = [{
          name: 'name',
          url: row.userImg
        }]
      },
      fileChange(file) {
        console.log(file)
        this.fileList = [file]
        getBase64(file.raw).then(res => {
          this.userImg = res
        })
        // console.log(file, getBase64(file));
      },
      getUsersList() {
        this.$http({
          url: '/parent/getUsersList',
          method: 'post'
        }).then(res => {
          this.tableData = res.data.userList || []
        })
      },
      handleCurrentChange() {

      },
      handleSizeChange() {

      },
      // 关闭弹框之前
      handleClose() {
        this.closeDialog()
      }
    }
  }
</script>
<style lang="scss" scoped>
img {
  width: 40px;
  height: 40px;
}
.el-pagination {
  // text-align: left;
  float: right;
  margin: 20px 0;
}
.el-row {
  text-align: right;
}
</style>
