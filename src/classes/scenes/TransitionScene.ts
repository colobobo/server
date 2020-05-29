import { PlayerStatus } from '@colobobo/library';
import { Scene } from '@/types';
import { Game, Player } from '@/classes';

export class TransitionScene implements Scene {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  init() {
    console.log('INIT');
    // TODO: Emit event with params
  }

  playerReady(player: Player) {
    player.status = PlayerStatus.ready;
    // TODO: If all ready => start round
  }

  start() {
    console.log('START');
    // TODO: When all players are ok => emit event
  }

  end() {
    if (this.game.life > 0) {
      this.game.switchToScene('round');
      this.game.roundScene.init();
    } else {
      this.game.end();
    }

    this.clear();
  }

  clear() {
    console.log('CLEAR');
  }
}
