import * as express from 'express';
import { Socket } from 'socket.io';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('port', process.env.PORT || 3000);

io.on('connection', function(socket: Socket) {
  console.log('User connected:', socket.id);

  socket.on('message', function(message: string) {
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
