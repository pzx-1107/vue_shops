/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-17 14:35:55
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-20 13:31:12
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/login.vue"
Vue.use(VueRouter)

const routes = [{
        path: "/",
        redirect: "/login"
    },
    {
        path: '/login',
        component: Login
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
        ]
    }

]

const router = new VueRouter({
    routes
})

export default router