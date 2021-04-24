/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-17 14:48:14
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-20 12:27:16
 */
// 封装axios 请求
import axios from 'axios'
export default function(config) {
    // 创建axios实例
    const instance = axios.create({
            baseURL: '/api',
        })
        // 添加拦截操作
        // 添加请求拦截器
    instance.interceptors.request.use(function(config) {
        // 在发送请求之前做些什么
        if (config.url != '/login') {
            // 获取 token
            let token = sessionStorage.getItem('token');
            // // 保存 token
            config.headers.Authorization = token;
        }
        // config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
            // console.log(config.url)
    }, function(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 添加响应拦截器
    instance.interceptors.response.use(function(response) {
        // 对响应数据做点什么
        return response.data;

    }, function(error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });
    return instance(config);
}