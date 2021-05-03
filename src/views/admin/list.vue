<template>
  <div class="about">
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="formInline.goodName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 28px">
      <el-row>
        <el-button type="primary" @click="handleaddBtn">新增商品</el-button>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="goodId"
          label="商品ID"
          width="180">
        </el-table-column>
        <el-table-column
          label="商品主图"
          width="180">
          <template slot-scope="scope">
            <img :src="scope.row.goodImg" alt="" srcset="">
          </template>
        </el-table-column>
        <el-table-column
          prop="goodName"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价钱">
          <template slot-scope="scope">
            <span>¥{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stockNum"
          label="库存">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row, 'detail')" type="text" size="small">查看</el-button>
            <el-button type="text" size="small" @click="handleClick(scope.row, 'edit')">编辑</el-button>
            <el-button type="text" size="small" @click="deleteGoods(scope.row.goodId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="商品信息"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <el-form :model="ruleForm" :show-message="false" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" required prop="goodName">
          <el-input v-model="ruleForm.goodName"></el-input>
        </el-form-item>
        <el-form-item label="价钱" prop="price" required>
          <el-input v-model="ruleForm.price"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stockNum" required>
          <el-input v-model.number="ruleForm.stockNum"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" required>
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
        goodImg: '',
        tableData: [],
        rowdata: {},
        type: ''
      }
    },
    mounted() {
      this.onSubmit()
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
              url: '/parent/doGoods',
              method: 'post',
              data: {
                method:	this.type, //edit/add/delete
                goodId: this.type === 'add' ? '' : this.rowdata.goodId,
                goodImg: this.goodImg,
                goodName: this.ruleForm.goodName,
                price: this.ruleForm.price,
                stockNum: this.ruleForm.stockNum
              }
            }).then(res => {
              if (res.data.status) {
                this.closeDialog()
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
            return false
          }
        })
      },
      deleteGoods(goodId) {
        this.$http({
          url: '/parent/doGoods',
          method: 'post',
          data: {
            method:	'delete', //edit/add/delete
            goodId: goodId,
          }
        }).then(res => {
          if (res.data.status) {
            this.onSubmit()
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
        this.rowdata = row
        this.ruleForm = row
        this.goodImg = row.goodImg
        this.fileList = [{
          name: 'name',
          url: row.goodImg
        }]
      },
      fileChange(file) {
        this.fileList = [file]
        getBase64(file.raw).then(res => {
          this.goodImg = res
        })
      },
      onSubmit() {
        this.$http({
          url: '/parent/getGoodsList',
          method: 'post',
          data: {
            search: this.formInline.goodName
          }
        }).then(res => {
          this.tableData = res.data.goodsList
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
