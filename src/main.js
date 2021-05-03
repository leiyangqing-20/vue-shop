import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import request from './utils/request.js'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.scss' // 格式化样式
import '@/assets/style.scss' // 全局样式

import './assets/icons/index'


Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$http = request
Vue.prototype.$moment = moment

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
