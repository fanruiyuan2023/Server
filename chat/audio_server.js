/*
1. 注意修改运行参数启动audio_server.js文件
2. 启动该文件后，需要在浏览器运行localhost:3000，启动两个浏览器，验证效果
*/


const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
//const wrtc = require('wrtc');
var room_code = '';

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/audio_demo.html');

});

io.on('connection', socket => {

  console.log('connect from:' + socket.id);

  socket.on('join', room => {
    console.log('join room:' + room);
    room_code = room;
    socket.join(room);
  });

  socket.on('offer', (room, offer) => {
    console.log('offer...');
    socket.to(room).emit('offer', offer);
  });

  socket.on('answer', (room, answer) => {
    console.log('answer...');
    socket.to(room).emit('answer', answer);
  });

  socket.on('ice-candidate', (room, candidate) => {
    console.log('ice-candidate');
    socket.to(room).emit('ice-candidate', candidate);
  });

  socket.on('closeMedia', (room, command) => {
    console.log('closeMedia');
    socket.to(room).emit('closeMedia', command);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected:', socket.id);
    socket.leave(room_code);
  });
  
});


server.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});