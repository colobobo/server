import { EventsRoom, PayloadsRoom } from 'fast-not-fat';
import { Player, Room } from '@/classes';
import { gameProperties } from '@/config/game-properties';
import { log } from '@/utils';

export const create = function(device: PayloadsRoom.Create) {
  // TODO: Add id verification
  const randomBetweenNumbers = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
  const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
  const id = zeroPad(randomBetweenNumbers(1, 9999), 4);

  this.join(id, () => {
    const room = new Room(id);
    const player = new Player(this);

    room.addPlayer(player);
    room.game.area.addDeviceToArea(player.id, device);

    global.rooms.set(id, room);

    this.emit(EventsRoom.createSuccess, {
      data: {
        id,
        deviceId: player.id,
      },
    } as PayloadsRoom.CreateSuccess);
    log(`Created room ${id}`);
  });

  // TODO: If it fails, emit error
};

export const join = function(args: PayloadsRoom.Join) {
  const { id, width, height } = args;
  const currentRoom = global.rooms.get(id);
  const player = new Player(this);

  if (currentRoom) {
    if (currentRoom.players.size < gameProperties.players.max) {
      this.join(id, () => {
        currentRoom.addPlayer(player);
        currentRoom.game.area.addDeviceToArea(player.id, { width, height });

        this.emit(EventsRoom.joinSuccess, {
          data: {
            id,
            deviceId: player.id,
          },
        } as PayloadsRoom.JoinSuccess);
        log(`Joined room ${id}`);
      });
    } else {
      this.emit(EventsRoom.joinError, {
        code: 2,
        data: null,
        message: 'Room is full',
      } as PayloadsRoom.JoinError);
      log('Room is full');
    }
  } else {
    this.emit(EventsRoom.joinError, {
      code: 1,
      data: null,
      message: 'Room does not exists',
    } as PayloadsRoom.JoinError);
    log('Room does not exists');
  }
};
