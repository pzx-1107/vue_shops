/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: 叶志文
 * @Date: 2021-04-13 16:07:11
 * @LastEditors: 叶志文
 * @LastEditTime: 2021-04-24 15:49:42
 */
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8888/api/private/v1',
                pathRewrite: { '^/api': '' },
                ws: true,
                changeOrigin: true
            },

        }
    }
}