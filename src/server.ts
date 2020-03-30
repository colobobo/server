import * as express from 'express';
import { Socket } from 'socket.io';
import { EventsRoom, PayloadsRoom } from 'fast-not-fat';
import * as socketRoom from './sockets/room';
import { log } from './utils';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const rooms = io.sockets.adapter.rooms;

app.use(cors());

io.on('connection', function(socket: Socket) {
  socket.on(EventsRoom.create, (args: PayloadsRoom.Create) => socketRoom.create(socket, args));
  socket.on(EventsRoom.join, (args: PayloadsRoom.Join) => socketRoom.join(socket, rooms, args));
});

http.listen(PORT, function() {
  log(`Listening on localhost:${PORT}`);
});
