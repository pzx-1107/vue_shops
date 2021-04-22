/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-20 15:13:22
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-21 19:41:45
 */
import Http from "./index"
// 获取用户数据列表
export function usersList(config) {
    return Http({
        url: '/users',
        method: 'get',
        params: config
    })
}
//根据id搜索用户
export function usersIdSearch(url) {
    return Http({
        url,
        method: 'get',
    })
}
//添加用户
export function usersListAdd(data) {
    return Http({
        data,
        url: '/users',
        method: 'post',
    })
}
//修改用户状态
export function mg_state_alter(url) {
    return Http({
        url,
        method: 'put',
    })
}
//修改用户信息
export function amendUsers(url, config) {
    return Http({
        url,
        method: 'put',
        data: config,
    })
}
//删除用户信息
export function removeUsers(url) {
    return Http({
        url,
        method: 'delete',
    })
}
//分配角色
export function assignRole(url, data) {
    return Http({
        url,
        method: 'put',
        data
    })
}