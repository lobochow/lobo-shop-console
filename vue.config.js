const path = require('path');
module.exports = {
	lintOnSave: false,
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        }
    },
    devServer:{
        proxy: {
        	//请求中带有/mock的会自动向以下服务器请求
            '/v1': {
                target: 'http://127.0.0.1:8088'
            }
        }
    }
}