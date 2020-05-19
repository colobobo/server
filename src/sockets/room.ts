import { events, payloads } from 'fast-not-fat';
import { Player, Room } from '@/classes';
import { gameProperties } from '@/config/game-properties';
import { emitCallback, emitErrorCallback, generateUid, log } from '@/utils';

export const create = function(device: payloads.room.Create) {
  const uid = generateUid();

  this.join(uid, () => {
    const room = new Room(uid);
    const player = new Player(this);

    room.addPlayer(player);
    room.game.area.addDeviceToArea(player.id, device);
    global.rooms.set(uid, room);

    this.emit(
      events.room.createSuccess,
      emitCallback<payloads.room.CreateSuccess>({ id: uid, deviceId: player.id }),
    );
    log(`Created room ${uid}`);
  });
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

        this.emit(
          events.room.joinSuccess,
          emitCallback<payloads.room.JoinSuccess>({ id, deviceId: player.id }),
        );
        log(`Joined room ${id}`);
      });
    } else {
      this.emit(events.room.joinError, emitErrorCallback<payloads.room.JoinError>(2, 'Room is full'));
      log('Room is full');
    }
  } else {
    this.emit(events.room.joinError, emitErrorCallback<payloads.room.JoinError>(1, 'Room does not exists'));
    log('Room does not exists');
  }
};
