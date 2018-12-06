// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VCharts from 'v-charts'
import * as custom from './filter'
// 移动端弹框
import layer from 'vue2-layer-mobile'
// import CryptoJS from 'crypto-js'
import 'babel-polyfill'
import '../static/css/custom.css'

Vue.prototype.$sub = new Vue()
Vue.use(BootstrapVue)
Vue.use(ElementUI)
Vue.use(VCharts)
Vue.use(layer)

// 我的地址10.26.136.24/黄总47.98.173.73/自己访问127.0.0.1 /http://10.26.136.20:8080
axios.defaults.timeout = 15000
axios.defaults.withCredentials = true
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://' + window.location.hostname + ':' + window.location.port
} else {
  axios.defaults.baseURL = 'http://10.26.136.53:8080'
}

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.token) {
      config.headers.Authorization = store.state.token
      config.headers.userId = store.state.user.userId
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

router.beforeEach((to, from, next) => {
  let logined = store.state.logined
  // console.log(to.path)
  if (to.path === '/login' || to.path === '/oalogin' || to.path === '/info_cn'|| to.path === '/info_en') {
    if (logined) {
      store.commit('loginState', false)
      store.commit('loginUser', {})
      store.commit('setterToken', '')
      store.commit('setterTodoActiviTab', '')
      store.commit('setterDoneActiviTab', '')
    }
    next()
  } else {
    if (logined) {
      next()
    } else {
      next('/login')
    }
  }
})

Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  axios,
  store,
  router,
  template: '<App/>',
  components: {
    App
  }
})
