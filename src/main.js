/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-17 14:35:55
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-20 13:22:41
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

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')