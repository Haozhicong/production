// let path = require('path')

// function resolve(dir) {
//     return path.join(__dirname, dir)
// }
// module.exports = {
//     chainWebpack: config => {
//         config.resolve.alias
//             .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
//             // .set('vendor', resolve('../src/vendor'))
//     }
// }
// vue.config.js
module.exports = {
    publicPath: "./",
    outputDir: "dist",
    assetsDir: "assets",
    indexPath: "index.html",
    filenameHashing: true,
    pages: undefined,
    lintOnSave: true,
    runtimeCompiler: false,
    transpileDependencies: [],
    productionSourceMap: false,
    crossorigin: undefined,
    integrity: false,
    devServer: {//代理
        port: 8080,
        proxy: 'http://192.168.31.14:8080'
    }
}