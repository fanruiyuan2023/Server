
/*
1. 注意修改运行参数启动index.js文件
2. 启动该文件后，需要在容器中运行three_demo_1.html和three_demo_2.html
*/

const express = require('express');
const cors = require('cors');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

let clients = [];

// 配置解决跨域问题
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');

});

io.on('connection', (socket) => {

  console.log('a user connected:', socket.id);
  addSocketId(socket.id);
  
  socket.on('chat message', (msg) => {
    //console.log('socketId:' + socket.id + ',' + 'message: ' + msg);
    //io.emit('chat message', msg);
    // 向除自己之外的其他客户都通告消息
    for(var i=0;i<clients.length;i++){
      if(clients[i] != socket.id){
        console.log("send msg to " + clients[i]);
        //console.log(msg);
        io.to(clients[i]).emit('chat message', msg);
      }
    }
  });
  

  socket.on('disconnect', function(){
      console.log('user disconnected:', socket.id);
      removeSocketId(socket.id);
  })

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

///////////////////////////////////////////////////////////////

// 添加ID
function addSocketId(id){
  if(id in clients == false){
    clients.push(id);
  }
}

// 删除ID
function removeSocketId(id){
  if(id in clients){
    var i = clients.indexOf(id);
    clients.splice(i,1);
  }
}