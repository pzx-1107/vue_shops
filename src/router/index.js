/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-17 14:35:55
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-24 15:53:46
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/login.vue"
Vue.use(VueRouter)



// // 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//     return originalPush.call(this, location).catch(err => err)
// }

const routes = [{
        path: "/",
        redirect: "/login"
    },
    {
        path: '/login',
        component: Login,
    }, {
        path: '/home',
        component: () =>
            import ( /* webpackChunkName: "home" */ '../views/home.vue'),
        children: [{
                path: "/home",
                component: () => {
                    return import ( /* webpackChunkName: "homeChildren" */ '../components/welcome.vue')
                },
            }, {
                path: "users",
                component: () => {
                    return import ( /* webpackChunkName: "homeChildren" */ '../components/home/users.vue')
                },
            }, {
                path: "roles",
                component: () => {
                    return import ( /* webpackChunkName: "homeChildren" */ '../components/home/roles.vue')
                },
            }, {
                path: "rights",
                component: () => {
                    return import ( /* webpackChunkName: "homeChildren" */ '../components/home/rights.vue')
                },
            }, {
                path: "goods",
                component: () => {
                    return import ( /* webpackChunkName: "homeChildren" */ '../components/home/goods.vue')
                },
            }, {
                path: "params",
                component: () => {
                    return import ( /* webpackChunkName: "homeChildren" */ '../components/home/params.vue')
                },
            },
            {
                path: "categories",
                component: () => {
                    return import ( /* webpackChunkName: "homeChildren" */ '../components/home/categories.vue')
                },
            },
            {
                path: "orders",
                component: () => {
                    return import ( /* webpackChunkName: "homeChildren" */ '../components/home/orders.vue')
                },
            },
            {
                path: "reports",
                component: () => {
                    return import ( /* webpackChunkName: "home" */ '../components/home/reports.vue')
                },
            },
            {
                path: "/goods/addCommodity",
                component: () => {
                    return import ( /* webpackChunkName: "home" */ '../components/home/addCommodity.vue')
                },
            },
        ]
    }

]

const router = new VueRouter({
    routes
})

export default router