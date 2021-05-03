<template>
  <el-container>
    <el-aside width="200px" style="height: 100%">
      <el-menu :default-active="$route.path" router background-color="#545c64" text-color="#fff">
        <el-menu-item index="/admin/list">
          <i class="el-icon-menu"></i>
          <span slot="title">商品管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/user">
          <i class="el-icon-menu"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/order">
          <i class="el-icon-menu"></i>
          <span slot="title">订单管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{ userName }}</span>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  export default {
    created() {
      this.$store.dispatch('setUserId', this.$store.state.userId)
    },
    computed: {
      userName () {
        return this.$store.state.userData?.userName || '未登录'
      }
    },
    methods: {
      logout() {
        this.$route.push('/login')
      }
    }
  };
</script>
<style lang="scss" scoped>
.el-header {
  border-bottom: solid 1px #e6e6e6;
  background: #fff;
  color: #333;
    line-height: 60px;
}
.el-aside {
  color: #333;
}
</style>