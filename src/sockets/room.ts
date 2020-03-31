import { Socket } from 'socket.io';
import { EventsRoom, PayloadsRoom } from 'fast-not-fat';
import { RoomInterface } from '@/types';
import { Player, Room } from '@/classes';
import { gameProperties } from '@/config/game-properties';
import { log } from '@/utils';

export const create = (socket: Socket, device: PayloadsRoom.Create) => {
  // TODO: Add id verification
  const randomBetweenNumbers = (min: number, max: number) => Math.floor(Math.random()*(max-min+1)+min);
  const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
  const id = zeroPad(randomBetweenNumbers(1, 9999), 4);

  const client = socket.join(id);
  const room = new Room(id, socket);

  room.addPlayer(new Player(client, socket, device));
  global.rooms.set(id, room);

  socket.emit(EventsRoom.createSuccess, ({ data: { id } } as PayloadsRoom.CreateSuccess));

  // TODO: If it fails, emit error
  log(`Created room ${id}`);
};

export const join = (socket: Socket, rooms: RoomInterface[], args: PayloadsRoom.Join) => {
  const { id, width, height } = args;
  const currentRoom = global.rooms.get(id);

  if (currentRoom) {
    if (currentRoom.players.size < gameProperties.players.max) {
      const client = socket.join(id);

      currentRoom.addPlayer(new Player(client, socket, { width, height }));

      socket.emit(EventsRoom.joinSuccess, ({
        data: { id }
      }) as PayloadsRoom.JoinSuccess);

      log(`Joined room ${id}`);
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
