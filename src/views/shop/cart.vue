<template>
  <div class="cart-page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/shop' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/shop/cart' }">购物车</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        ref="multipleTable"
        :data="buyGoodsList"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="图片" width="180">
          <template slot-scope="scope">
            <img :src="scope.row.goodImg" alt="" srcset="">
          </template>
        </el-table-column>
        <el-table-column prop="goodName" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="price" label="单价">
          <template slot-scope="{row}">
            ¥{{row.price}}
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="数量">
          <template slot-scope="{row}">
            <el-input-number size="small" v-model="row.num" :min="1" :max="row.stockNum"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="stockNum"
          label="剩余库存">
          <template slot-scope="{row}">
            {{row.stockNum > 0 ? row.stockNum : 1}}
          </template>
        </el-table-column>
        <el-table-column label="小计">
          <template slot-scope="{row}">
            ¥{{row.num * row.price}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="text" @click="deleteGood(row)">删除</el-button>
            <el-button type="text" @click="buyShop(row)">购买</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="footer-btn">
      <span class="check-num">您已选择{{selectionData.length}}件商品</span>
      <el-button type="danger" :disabled="selectionData.length === 0" @click="buyShop">去 结 算</el-button>
    </el-card>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="() => dialogVisible = false">
      <span>请输入密码</span>
      <el-input v-model="password" type="password"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="gobuyShop">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      buyGoodsList: [],
      selectionData: [],
      dialogVisible: false,
      password: ''
    }
  },
  created() {
    this.buyGoodsList = JSON.parse(sessionStorage.getItem('buyGoodsList'))
  },
  computed: {
    userName () {
      return this.$store.state.userData?.userName || '未登录'
    },
    loginName () {
      return this.$store.state.userData?.loginName || ''
    }
  },
  methods: {
    AllSelection() {
      this.toggleSelection()
      this.$refs.multipleTable.toggleAllSelection
    },
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    handleSelectionChange(val) {
      this.selectionData = val
    },
    deleteGood(row) {
      let data = [].concat(row)
      let goodIdList = data.map(item => item.goodId)
      this.buyGoodsList = this.buyGoodsList.filter(item => !goodIdList.includes(item.goodId))
      sessionStorage.setItem('buyGoodsList', JSON.stringify(this.buyGoodsList))
    },
    buyShop(row) {
      this.selectionData = [row]
      this.dialogVisible = true
      this.password = ''
    },
    async gobuyShop() {
      if (!this.password) {
        this.$message({
          type: 'warning',
          message: '请填写密码'
        })
        return
      }
      let flag = false
      await this.$http({
        url: '/loginIn',
        method: 'post',
        data: {
          loginName: this.loginName,
          loginPwd: this.password
        }
      }).then(res => {
        if (res.error !== 0 || !res.data.canLogin) {
          this.$message({
            type: 'error',
            message: '密码错误，请重新填写'
          })
          flag = true
        }
      })
      if (flag) return
      let List = this.selectionData.map(item => {
        return {
          goodId: item.goodId,
          num: item.num,
          goodName: item.goodName,
          goodImg: item.goodImg,
          userName: this.userName
        }
      })
      this.$http({
        url: '/checkOrder',
        method: 'post',
        data: {
          buyGoodsList: List,
          userId: this.$store.state.userId,
          loginpwd: this.password
        }
      }).then(res => {
        if (res.data.status) {
          this.deleteGood(List)
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.dialogVisible = false
          this.$router.push('/shop/order')
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
img {
  width: 60px;
  height: 60px;
}
.cart-page {
  padding-bottom: 44px;
}
.footer-btn {
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
  padding-right: 80px;
  text-align: right;
  background: #fff;
  z-index: 100;
  .el-button {
    margin-left: 20px;
    padding: 0 20px;
  }
  .check-num {
    font-size: 16px;
    color: #d44b0c;
  }
}
.el-breadcrumb {
  margin-bottom: 44px;
}
</style>