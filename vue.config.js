const RestProxy = require('sp-rest-proxy');
module.exports = {
  devServer: {
    host: 'localhost',
    inline: true,
    hot: true,
    port: 3000,
    proxy: 'http://localhost:8080',
    before: () =>
      new RestProxy({
        configPath: './dev/private.json',
        hostname: 'localhost',
        port: 8080
      }).serve()
  }
};
