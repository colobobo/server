import { events, payloads } from 'fast-not-fat';
import { Player, Room } from '@/classes';
import { gameProperties } from '@/config/game-properties';
import { log } from '@/utils';

export const create = function(device: payloads.room.Create) {
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

    this.emit(events.room.createSuccess, {
      data: {
        id,
        deviceId: player.id,
      },
    } as payloads.room.CreateSuccess);
    log(`Created room ${id}`);
  });

  // TODO: If it fails, emit error
};

export const join = function(args: payloads.room.Join) {
  const { id, width, height } = args;
  const currentRoom = global.rooms.get(id);
  const player = new Player(this);

  if (currentRoom) {
    if (currentRoom.players.size < gameProperties.players.max) {
      this.join(id, () => {
        currentRoom.addPlayer(player);
        currentRoom.game.area.addDeviceToArea(player.id, { width, height });

        this.emit(events.room.joinSuccess, {
          data: {
            id,
            deviceId: player.id,
          },
        } as payloads.room.JoinSuccess);
        log(`Joined room ${id}`);
      });
    } else {
      this.emit(events.room.joinError, {
        code: 2,
        data: null,
        message: 'Room is full',
      } as payloads.room.JoinError);
      log('Room is full');
    }
  } else {
    this.emit(events.room.joinError, {
      code: 1,
      data: null,
      message: 'Room does not exists',
    } as payloads.room.JoinError);
    log('Room does not exists');
  }
};
