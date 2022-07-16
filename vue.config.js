const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    lintOnSave: false,
    publicPath: './',
    indexPath: 'console.html',
    outputDir: "C:\\Users\\lobo\\Desktop\\lobo-shop-project\\lobo-shop-server\\public\\console",
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        devtool: 'eval-source-map'
    },
    devServer: {
        proxy: {
            //请求中带有/mock的会自动向以下服务器请求
            '/v1': {
                target: 'http://45.45.177.71:8088'
            }
        }
    }
}