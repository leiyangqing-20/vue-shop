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
