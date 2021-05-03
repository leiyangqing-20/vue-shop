import qs from 'qs'
import Cookie from 'js-cookie'
import axios from 'axios'

axios.defaults.baseURL = process.env.NODE_ENV == 'development'? '/' : '';
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 加token
  // config 是请求配置  如果你需要额外配置  config进行修改
  // 把修改好的config 返回出去  axios才回使用你修改的配置
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  config.headers['x-csrf-token'] = Cookie.get('csrfToken')
  config.baseURL = '/api'
  config.data = qs.stringify({
    ...config.data
  })
  return config;
}, function (error) {
  console.log('axios-error', error)
  return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  // 获取响应状态码  判断是否401
  // error.response 响应对象
  // error.response.status 状态码
  return Promise.reject(error);
})
export default axios