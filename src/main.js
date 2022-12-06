import Vue from 'vue'
import App from './App.vue'

import router from './router/router'
// http ����
import http from '@/utils/http.js'
// api �ӿ�
import api from '@/utils/api'
//  element ui ��ȫ����
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import storage from "@/utils/storage";
Vue.use(ElementUI, { size: 'medium', zIndex: 3000 });
Vue.config.productionTip = false
Vue.prototype.$http = http // ajax���󷽷�
Vue.prototype.$api = api
Vue.prototype.$storage = storage

// main.js
Vue.prototype.$scrollTo = (x = 0, y = 0, type = 'smooth') => {
  window.scrollTo({
    top: x,
    left: y,
    behavior: type // ������Ϊ��smoothƽ��������instant˲�������Ĭ��ֵauto����ͬ��instant
  })
}
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
