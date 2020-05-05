require('module-alias/register');

import * as express from 'express';
import { Socket } from 'socket.io';
import { events } from 'fast-not-fat';
import * as socketRoom from '@/sockets/room';
import { log } from './utils';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

const PORT = process.env.PORT || 3001;

global.rooms = new Map();
global.io = io;

app.use(cors);

io.on('connection', function(socket: Socket) {
  socket.on(events.room.create, socketRoom.create.bind(socket));
  socket.on(events.room.join, socketRoom.join.bind(socket));
});

http.listen(PORT, function() {
  log(`Listening on localhost:${PORT}`);
});
