import * as express from 'express';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('port', process.env.PORT || 3000);

io.on('connection', function(socket: any) {
  console.log('User connected:', socket.id);

  socket.on('message', function(message: any) {
    console.log('New message:', message);
    socket.emit('message', message);
  });

  socket.on('disconnect', function() {
    console.log('User disconnected:', socket.id);
  });
});

http.listen(3000, function() {
  console.log('Listening on localhost:3000');
});