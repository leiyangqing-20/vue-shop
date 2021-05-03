<template>
  <div class="header-wrap">
    <div class="search-header">
      <div class="logo-box">
        <img src="@/assets/images/logo.png" alt="logo" srcset="">
      </div>
      <div class="search-wrap flexbox">
        <el-input v-model="goodName" placeholder="请输入商品名称"></el-input>
        <el-button icon="el-icon-search" @change="getGoodList">搜索</el-button>
      </div>
    </div>
    <div class="list-wrap">
      <div class="list-content flexbox" v-for="item in tableData" :key="item.goodId" @click="detailsLink(item)">
        <img :src="item.goodImg" alt="" srcset="">
        <div class="goods-title">{{item.goodName}}</div>
        <div class="goods-price">¥{{item.price}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      goodName: ''
    }
  },
  mounted() {
    this.getGoodList()
  },
  methods: {
    getGoodList() {
      this.$http({
        url: '/getGoods',
        method: 'post',
        data: {
          goodName: this.goodName
        }
      }).then(res => {
        console.log(res.data)
        this.tableData = res.data.goodsList
      })
    },
    // 详情跳转
    detailsLink(item) {
      window.sessionStorage.setItem('shopInfo', JSON.stringify(item))
      this.$router.push('/shop/detail')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-header {
  display: flex;
  .logo-box {
    width: 300px;
    text-align: center;
  }
  .search-wrap {
    flex: 1;
    padding-right: 100px;
    .el-input {
      // width: 100%;
    }
  }
}
.list-wrap {
  border-top: 1px solid #f2f2f2;
  border-left: 1px solid #f2f2f2;
  .list-content {
    flex-direction: column;
    width: 236px;
    height: 306px;
    box-sizing: border-box;
    display: inline-block;
    font-size: 12px;
    border: 1px solid #f2f2f2;
    border-top: none;
    border-left: none;
    background: #fff;
    vertical-align: top;
    padding: 22px 20px 0;
  }
  img {
    width: 198px;
    height: 198px;
  }
  .goods-title {
    vertical-align: middle;
    white-space: normal;
    font-size: 14px;
    color: #9b9b9b;
    line-height: 20px;
  }
  .goods-price {
    margin-left: 4px;
    vertical-align: baseline;
    text-align: left;
    line-height: 25px;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #fd3f31;
  }
}
</style>