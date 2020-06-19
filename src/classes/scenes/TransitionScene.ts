import { events, payloads, enums } from '@colobobo/library';
import { Game, Player, Room } from '@/classes';
import { emitGlobal } from '@/utils';

export class TransitionScene {
  game: Game;
  room: Room;

  constructor(room: Room, game: Game) {
    this.game = game;
    this.room = room;
  }

  init() {
    console.log(events.transition.init);
    emitGlobal<payloads.transition.Init>({ roomId: this.room.id, eventName: events.transition.init });

    // TODO: remove, this is temporary
    if (this.game.lives > 0) {
      this.game.roundScene.init();
    }
  }

  playerReady(player: Player) {
    console.log(events.transition.playerReady, player.id);
    player.isReady = true;
    if (Array.from(this.room.players.values()).every(player => player.isReady)) this.start();
  }

  start() {
    console.log(events.transition.start);
    emitGlobal<payloads.transition.Start>({ roomId: this.room.id, eventName: events.transition.start });
  }

  end() {
    console.log(events.transition.ended);

    this.room.players.forEach(player => (player.isReady = false));

    if (this.game.lives > 0) {
      this.game.switchToScene(enums.scene.Type.round);
    } else {
      this.game.end();
    }

    this.clear();
  }

  clear() {
    console.log('CLEAR TRANSITION SCENE');
  }
}
