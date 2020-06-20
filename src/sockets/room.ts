import { events, payloads } from '@colobobo/library';
import { Player, Room } from '@/classes';
import { gameProperties } from '@/config/game-properties';
import { emitCallback, emitErrorCallback, emitGlobal, generateUid, log } from '@/utils';

export const create = function(event: payloads.room.Create) {
  const uid = generateUid();
  let player: null | Player = null;

  this.join(uid, () => {
    const room = new Room(uid);
    if (event.isAdmin) {
      room.isAdmin = true;
    } else {
      player = new Player(this);
      player.isCreator = true;
      room.addPlayer(player);
      room.game.area.addDeviceToArea(player.id, { width: event.width, height: event.height });
    }

    global.rooms.set(uid, room);
    console.log('CREATED ROOM', uid);

    this.emit(
      events.room.createSuccess,
      emitCallback<payloads.room.CreateSuccess>({
        id: uid,
        playerId: player?.id,
        players: gameProperties.players,
      }),
    );
  });
};

export const join = function(args: payloads.room.Join) {
  const { id, width, height, adminIndex } = args;
  const currentRoom = global.rooms.get(id);
  const player = new Player(this);

  if (currentRoom) {
    // if no player, player is creator
    if (currentRoom.players.size === 0) {
      player.isCreator = true;
    }
    if (currentRoom.players.size < gameProperties.players.max) {
      this.join(id, () => {
        currentRoom.addPlayer(player);
        currentRoom.game.area.addDeviceToArea(player.id, { width, height });

        this.emit(
          events.room.joinSuccess,
          emitCallback<payloads.room.JoinSuccess>({
            id,
            isCreator: player.isCreator,
            playerId: player.id,
            players: gameProperties.players,
          }),
        );

        // if is admin & has admin index -> emit admin device connected

        if (currentRoom.isAdmin && adminIndex) {
          emitGlobal<payloads.admin.DeviceConnected>({
            roomId: currentRoom.id,
            eventName: events.admin.deviceConnected,
            data: {
              deviceIndex: adminIndex,
              playerId: player.id,
            },
          });
        }

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
