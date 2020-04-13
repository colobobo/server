import { PlayerInterface, PlayerStatus, RoomInterface } from '@/types';
import { Game } from '@/classes/Game';

export class Room implements RoomInterface {
  id: string;
  players: Map<string, PlayerInterface>;
  game: Game;

  constructor(id: string) {
    this.id = id;
    this.players = new Map();

    this.createGame();
  }

  addPlayer(player: PlayerInterface) {
    this.players.set(player.id, player);

    player.socket.on('disconnect', () => {
      player.status = PlayerStatus.absent;
      // TODO: Set global status to pause
      if (!this.roomActive) global.rooms.delete(this.id);
    });
  }

  createGame() {
    this.game = new Game(this);
  }

  get roomActive() {
    let roomActive = false;

    Array.from(this.players.values()).forEach((player) => {
      if (player.status === 'active') roomActive = true;
    });

    return roomActive;
  }
}
