const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  devServer: {
    port: 5566,
    hotOnly: true, // 热更新
    proxy: {
      "/api": {
        // target:'http://openflow.api.wejoydata.com/mock/58', //mock地址
        target:'http://39.106.228.222:7001/api/',
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        secure: false,
        // ws: true, // 是否启用websockets
        pathRewrite: {
          "^/api": "/"
        }
      }
    },
  },
  chainWebpack: config => {
    config.resolve.alias.set("/@", resolve("src"))
    const svgRule = config.module.rule('svg')
    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear()
    svgRule
      .test(/\.svg$/)
      // 配置icons的目录  我这里默认放在了 /src/assets/icons 目录下  如要修改 记得更换你的目录
      .include.add(path.resolve(__dirname, './src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    const fileRule = config.module.rule('file')
    fileRule.uses.clear()
    fileRule
      .test(/\.svg$/)
      // 配置icons的目录  我这里默认放在了 /src/assets/icons 目录下  如要修改 记得更换你的目录
      .exclude.add(path.resolve(__dirname, './src/assets/icons'))
      .end()
      .use('file-loader')
      .loader('file-loader')
  }
};
