<template>
  <div class="detail-page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/shop' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/detail' }">详情页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-wrap flexbox">
      <div class="img-box">
        <el-carousel ref="carousel" :interval="5000" arrow="always" indicator-position="none" @change="carouselChange">
          <el-carousel-item v-for="item in 4" :key="item" class="img-box">
            <el-image 
              :src="detailInfo.goodImg" 
              :preview-src-list="[detailInfo.goodImg]">
            </el-image>
          </el-carousel-item>
        </el-carousel>
        <div class="flexbox indicator">
            <!-- v-for="item in 4"
            :key="item" -->
            <!-- @click="setActiveItem(item-1)" -->
          <div class="active">
            <el-image :src="detailInfo.goodImg"></el-image>
          </div>
        </div>
        
      </div>
      <div class="good-info">
        <h3 class="goods-title">{{detailInfo.goodName}}</h3>
        <div class="goods-price">价钱：<span>¥{{detailInfo.price}}</span></div>
        <div class="good-detail">
          <div class="goods-color">
            <span>颜色分类：</span>
            <el-image 
              style="width: 30px; height: 30px"
              :src="detailInfo.goodImg">
            </el-image>
          </div>
          <div class="goods-num" v-if="Number(detailInfo.stockNum) > 0">数量：
            <el-input-number v-model="num" :min="1" :max="detailInfo.stockNum" label="数量："></el-input-number>
          </div>
          <div class="goods-num">库存：
            <span>{{detailInfo.stockNum}}个</span>
          </div>
        </div>
        <el-button type="danger" icon="el-icon-goods" class="add-cart" @click="addShopCart" round>加入购物车</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      detailInfo: {},
      activeIndex: 0,
      num: 1
    }
  },
  created() {
    let shopInfo = sessionStorage.getItem('shopInfo')
    this.detailInfo = JSON.parse(shopInfo)
  },
  methods: {
    setActiveItem(val) {
      this.activeIndex = val
      this.$refs.carousel.setActiveItem(val)
    },
    carouselChange(val) {
      console.log(val)
      this.activeIndex = val
    },
    addShopCart() {
      if (this.num > this.detailInfo.stockNum) {
        this.$message({
          type: 'error',
          message: '库存不足，请联系管理员'
        })
        return
      }
      let buyGoodsList = JSON.parse(sessionStorage.getItem('buyGoodsList'))
      let goodInfo = (buyGoodsList || []).find(item => this.detailInfo.goodId === item.goodId) || []
      if (goodInfo.length === 0) {
        buyGoodsList = (buyGoodsList || []).concat({
          ...this.detailInfo,
          num: this.num
        })
      } else {
        buyGoodsList.map(item => {
          if (item.goodId === goodInfo.goodId) {
            item.num = item.num + this.num
          }
          return item
        })
      }
      sessionStorage.setItem('buyGoodsList', JSON.stringify(buyGoodsList))
      this.$router.push('/shop/cart')
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-wrap {
  width: 800px;
  border: 1px solid #E8E8E8;
  padding: 20px 20px 40px;
  margin: 44px auto 0;
  .good-info {
    flex: 1;
    margin-left: 20px;
  }
  .goods-title {
    min-height: 21px;
    font-size: 16px;
    font-weight: 700;
    line-height: 21px;
    color: #3C3C3C;
  }
  .goods-price {
    padding: 10px;
    background-color: #FFF2E8;
    font-size: 12px;
    color: #6c6c6c;
    border-bottom: 1px dotted #E8E8E8;
    span {
      font-size: 24px;
      color: rgb(255, 68, 0);
      font-weight: 700;
      text-decoration: none;
    }
  }
  .good-detail {
    margin-top: 10px;
    padding-bottom: 20px;
    border: 1px solid #F40;
    >div {
      padding: 10px
    }
  }
  .goods-color {
    font-size: 12px;
    line-height: 36px;
    display: flex;
    height: 46px;
    // justify-content: center;
    padding: 10px;
    span {
      vertical-align: top;
      line-height: 20px;
    }
    .el-image {
      border: 2px solid #F40;
    }
  }
  .goods-num {
    font-size: 12px;
    padding-left: 10px;
  }
  .add-cart {
    margin: 30px 10px 0;
  }
  .el-carousel {
    width: 400px;
    height: 400px;
    .el-image {
      display: flex;
      width: 400px;
      height: 400px;
      justify-content: center;
      align-items: center;
    }
  }
  .indicator {
    > div {
      margin: 12px;
      height: 50px;
      border: 2px solid #fff;
      &.active {
        border-color: #F40;
      }
    }
    .el-image {
      width: 50px;
      height: 50px;
    }
  }
}
</style>