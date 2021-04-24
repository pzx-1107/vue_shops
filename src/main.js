/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-17 14:35:55
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-24 15:56:16
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import TreeTable from 'tree-table-vue'
// <<<<<<< HEAD // >>>>>>> e0d3fde86cf562f51b0aad54571254f0230eae08

Vue.component(TreeTable.name, TreeTable)
import "./assets/quanjustyle.css"
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
    //富文本编辑器全局引入
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */ )
    // 更改页面title值
Vue.directive('title', {
    inserted: function(el, binding) {
        document.title = el.dataset.title
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')