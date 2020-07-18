var ws = require('nodejs-websocket');
var server = ws.createServer(function(conn){
  console.log('新的连接');
  // 绑定事件， 服务端接收客户端信息
  conn.on('text',function(str){
    console.log(str);
    // conn.sendText(str);
    // broadcast(str);
    var data = JSON.parse(str);
    switch(data.type){
      case 'setName':
        conn.nickname = data.name;
        broadcast(JSON.stringify({
          name:'server',
          text:data.name+'加入了房间'
        }));
      break;
      case 'chat':
        broadcast(JSON.stringify({
          name:conn.nickname,
          text:data.text
        }));
        break;
      default:
        break;
    }
  });
  // setTimeout(function(){
  //   conn.sendText('来自服务端消息');
  // },5000)
  //离开房间
  conn.on('close',function(){
    // console.log(err);
    broadcast(JSON.stringify({
      name:'server',
      text:conn.nickname+'离开了房间'
    }));
  });
  conn.on('error',function(err){
     console.log(err);
  });
}).listen(8888);
//所有连接都遍历出来发消息
function broadcast(str){
  server.connections.forEach((conn)=>{
    conn.sendText(str);
  });
}
console.log('Server running at http:localhost:8888');