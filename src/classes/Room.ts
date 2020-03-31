import { Socket } from 'socket.io';
import { PlayerInterface, PlayerStatus, RoomInterface } from '@/types';

export class Room implements RoomInterface {
  id: string;
  socket: Socket;
  players: Map<string, PlayerInterface>;
  length: number;

  constructor(id: string, socket: Socket) {
    this.id = id;
    this.socket = socket;
    this.players = new Map();
    this.length = 0;
  }

  addPlayer(player: PlayerInterface) {
    this.players.set(player.id, player);

    player.socket.on('disconnect', () => {
      player.status = PlayerStatus.absent;
      // TODO: Set global status to pause
      if (!this.roomActive) global.rooms.delete(this.id);
    });
  }

  get roomActive() {
    let roomActive = false;

    Array.from(this.players.values()).forEach((player) => {
      if (player.status === 'active') roomActive = true;
    });

    return roomActive;
  }
}
