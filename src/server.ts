import * as express from 'express';
import { Socket } from 'socket.io';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

app.set('port', process.env.PORT || 3001);
app.use(cors());

io.on('connection', function(socket: Socket) {
  console.log('User connected:', socket.id);

  // Admin
  socket.on('admin:listen', () => {
    console.log('Listen admin on', socket.id);
  });

  // Room
  socket.on('room:create', () => {
    console.log('Create room');
  });
  socket.on('room:join', () => {
    console.log('Join room');
  });

  socket.on('disconnect', function() {
    console.log('User disconnected:', socket.id);
  });
});

http.listen(3001, function() {
  console.log('Listening on localhost:3000');
});
