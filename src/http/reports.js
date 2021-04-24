/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-22 10:18:31
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-22 10:45:06
 */
import Http from './index';

//数据统计
export function num_axios() {
    return Http({
        url: 'reports/type/1',
        method: 'get'
    })
}