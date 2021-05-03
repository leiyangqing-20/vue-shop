<template>
  <div class="about">
    <el-card style="margin-top: 28px">
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
      </el-table>
    </el-card>
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
      this.getList()
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
        // 上传图片
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
            this.getList()
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
      getList() {
        this.$http({
          url: '/getOrder',
          method: 'post',
          data: {
            userId: this.$store.state.userId
          }
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
