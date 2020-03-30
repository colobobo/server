import { EventsRoom, PayloadsRoom } from 'fast-not-fat';
import { Socket } from 'socket.io';
import { gameProperties } from "../config/game-properties";
import { log } from '../utils';

export const create = (socket: Socket, args: PayloadsRoom.Create) => {
  // TODO: Add id verification
  const randomBetweenNumbers = (min: number, max: number) => Math.floor(Math.random()*(max-min+1)+min);
  const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
  const id = zeroPad(randomBetweenNumbers(1, 9999), 4);

  socket.join(id);
  socket.emit(EventsRoom.createSuccess, ({ data: { id } } as PayloadsRoom.CreateSuccess));

  // TODO: If it fails, emit error

  log(`Device width: ${args.width}`);
  log(`Device height: ${args.height}`);
  log(`Created room ${id}`);
};

export const join = (socket: Socket, rooms: any, args: PayloadsRoom.Join) => {
  const { id } = args;
  const currentRoom = rooms[id];

  if (currentRoom) {
    if (rooms[id].length < gameProperties.players.max) {
      socket.join(id, () => {
        log(`Joined room ${id}`);
        socket.emit(EventsRoom.joinSuccess, ({
          data: { id }
        }) as PayloadsRoom.JoinSuccess);
      });
    } else {
      socket.emit(EventsRoom.joinError, ({
        code: 2,
        data: null,
        message: 'Room is full'
      } as PayloadsRoom.JoinError));
      log('Room is full');
    }
  } else {
    socket.emit(EventsRoom.joinError, ({
      code: 1,
      data: null,
      message: 'Room does not exists'
    }) as PayloadsRoom.JoinError);
    log('Room does not exists');
  }
};
