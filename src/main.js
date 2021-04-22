/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-17 14:35:55
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-22 16:22:18
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import TreeTable from 'tree-table-vue'

Vue.use(TreeTable)
Vue.use(ElementUI);

Vue.config.productionTip = false
    //全局时间过滤器
Vue.filter('dataFormat', function(originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
        // yyyy-mm-dd hh:mm:ss
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



new Vue({
    router,
    render: h => h(App)
}).$mount('#app')