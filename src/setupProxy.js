
//const target = 'http://39.104.189.84:30300';  //阿里云IP
// const target = 'http://10.128.175.8:8086'
//const target = 'http://10.112.217.199:7979';
// const target = 'https://www.ananops.com/api/';
// const target='http://www.ananops.com:29995';
const target = 'http://10.112.196.254:29995';

const gantch = 'https://smart.gantch.cn/api/v1/'

const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy(['/uac','/pmc','/mdc','/mdmc','/bill','/imc','/rdc','/activiti','/amc','/spc','/websocket'],{target: target, changeOrigin: true}),
    
    proxy(['/deviceaccess'],{target: gantch,changeOrigin:true})
    // proxy(['/default'],{target})
  );
};