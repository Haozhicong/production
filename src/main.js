import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
axios.defaults.withCredentials = true
import { post, fetch } from './http/http'
//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;
Vue.prototype.$axios = axios;
// 

// 时间过滤器
Vue.filter("dateFormart", function (value, formartStr) {
    // 1.根据传入的毫秒创建时间对象
    var date = new Date(value);
    // 2.获取年月日
    var year = date.getFullYear();
    var month = date.getMonth() + 1 + "";
    var day = date.getDate() + "";
    var hours = date.getHours() + "";
    var min = date.getMinutes() + "";
    var sec = date.getSeconds() + "";
    // 3.判断需要格式化的格式
    if (formartStr && formartStr.toLowerCase() === 'yyyy-mm-dd') {
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } else {
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${hours.padStart(2, "0")}:${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
    }
});


// 引用echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 全局使用Element组件
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element, {
    size: 'small',
    zIndex: 3000
});
Vue.config.productionTip = false

new Vue({
    axios,
    router,
    render: h => h(App)
}).$mount('#app')