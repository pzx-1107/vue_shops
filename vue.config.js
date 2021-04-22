/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-13 16:07:11
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-22 10:42:06
 */
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.1.17:8888/api/private/v1',
                pathRewrite: { '^/api': '' },
                ws: true,
                changeOrigin: true
            },

        }
    }
}