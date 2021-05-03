<template>
  <div class="about">
    <el-card style="margin-top: 28px">
      <el-row style="text-algin: right">
        <el-button icon="el-icon-refresh-right" type="text" @click="getList">刷新列表</el-button>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="商品信息"
          width="180">
          <template slot-scope="scope">
            <img :src="scope.row.goodImg" alt="" srcset="">
          </template>
        </el-table-column>
        <el-table-column
          prop="orderId"
          label="订单id"
          width="180">
        </el-table-column>
        <el-table-column prop="num" label="下单数量"></el-table-column>
        <el-table-column
          prop="logistics"
          label="物流信息">
        </el-table-column>
        <el-table-column
          prop="time"
          :formatter="(row) => { return $moment(row.time).format('YYYY-MM-DD HH:mm:ss')}"
          label="下单时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row, 'edit')">修改物流信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="修改物流信息"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-form :model="ruleForm" :show-message="false" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="物流信息" prop="logistics" required>
          <el-input v-model="ruleForm.logistics"></el-input>
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
        orderId: '',
        userId: '',
        type: ''
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      handleaddBtn() {
        this.dialogVisible = true
        this.type = 'add'
        this.ruleForm = {}
      },
      addGoods() {
        this.$http({
          url: '/parent/changeWuLiu',
          method: 'post',
          data: {
            orderId: this.orderId,
            logistics: this.ruleForm.logistics,
            userId: this.userId
          }
        }).then(res => {
          if (res.data.status) {
            this.getList()
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
      },
      closeDialog() {
        this.dialogVisible = false
        this.orderId = ''
        this.userId = ''
        this.$refs['ruleForm'].resetFields();
      },
      handleRemove(){},
      handleClick(row) {
        this.dialogVisible = true
        this.orderId = row.orderId
        this.userId = row.userId
      },
      fileChange(file) {
        this.fileList = [file]
        getBase64(file.raw).then(res => {
          this.goodImg = res
        })
      },
      getList() {
        this.$http({
          url: '/parent/getOrderList',
          method: 'post',
        }).then(res => {
          this.tableData = res.data.orderList
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
