import Vue from 'vue'
import App from './App.vue'

import router from './router/router'
// http 请求
import http from '@/utils/http.js'
// api 接口
import api from '@/utils/api'
//  element ui 完全引入
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import storage from "@/utils/storage";
Vue.use(ElementUI, { size: 'medium', zIndex: 3000 });
Vue.config.productionTip = false
Vue.prototype.$http = http // ajax请求方法
Vue.prototype.$api = api
Vue.prototype.$storage = storage

// main.js
Vue.prototype.$scrollTo = (x = 0, y = 0, type = 'smooth') => {
  window.scrollTo({
    top: x,
    left: y,
    behavior: type // 滚动行为：smooth平滑滚动，instant瞬间滚动，默认值auto，等同于instant
  })
}
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
