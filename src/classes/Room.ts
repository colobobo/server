import { events, payloads } from 'fast-not-fat';
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
      if (!this.roomActive) {
        this.game.kill();
        global.rooms.delete(this.id);
      }
    });

    player.socket.on(events.game.start, () => {
      this.game.start();
    });

    player.socket.on(events.game.positionUpdate, (e: payloads.game.PositionUpdate) => {
      this.game.updatePosition(e);
    });
  }

  createGame() {
    this.game = new Game(this);
  }

  get roomActive() {
    let roomActive = false;

    Array.from(this.players.values()).forEach(player => {
      if (player.status === 'active') roomActive = true;
    });

    return roomActive;
  }
}
