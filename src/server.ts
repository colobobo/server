import * as express from 'express';
import { Socket } from 'socket.io';
import { gameProperties } from './config/game-properties';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

const PORT = process.env.PORT || 3001;
app.use(cors());

const rooms = io.sockets.adapter.rooms;

const log: (message: string) => void = (message: string | number) => console.log(message);

io.on('connection', function(socket: Socket) {
  log(`User connected: ${socket.id}`);

  // Room
  socket.on('room:create', () => {
    const randomBetweenNumbers = (min: number, max: number) => Math.floor(Math.random()*(max-min+1)+min);
    const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
    const id = zeroPad(randomBetweenNumbers(1, 9999), 4);
    // TODO: Add id verification

    socket.join(id);
    socket.emit('room:create:success', id);
    log(`Created room: ${id}`);
  });

  socket.on('room:join', (id) => {
    const currentRoom = rooms[id];

    if (currentRoom) {
      if (rooms[id].length < gameProperties.players.max) {
        socket.join(id);
        socket.emit('room:join:success', id);
        log(`Joined room: ${id}`);
      } else {
        socket.emit('room:join:error', {
          code: 2,
          message: 'Room is full'
        });
        log('Room is full');
      }
    } else {
      socket.emit('room:join:error', {
        code: 1,
        message: 'Room does not exists'
      });
      log('Room does not exists');
    }
  });

  socket.on('disconnect', function() {
    console.log('User disconnected:', socket.id);
  });
});

http.listen(PORT, function() {
  log(`Listening on localhost:${PORT}`);
});
