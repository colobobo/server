import { events, payloads, enums } from '@colobobo/library';
import { Scene } from '@/types';
import { Game, Player, Room } from '@/classes';
import { emitGlobal } from '@/utils';

export class TransitionScene implements Scene {
  game: Game;
  room: Room;

  constructor(room: Room, game: Game) {
    this.game = game;
    this.room = room;
  }

  init() {
    console.log(events.transition.init);
    emitGlobal<payloads.transition.Init>({ roomId: this.room.id, eventName: events.transition.init });
  }

  playerReady(player: Player) {
    console.log(events.transition.playerReady, player.id);
    emitGlobal<payloads.transition.PlayerReady>({ roomId: this.room.id, eventName: events.transition.playerReady });
    player.isReady = true;
    // TODO: If all ready => start transition
    this.start();
  }

  start() {
    console.log(events.transition.start);
    emitGlobal<payloads.transition.Start>({ roomId: this.room.id, eventName: events.transition.start });
  }

  end() {
    console.log(events.transition.ended);

    if (this.game.lives > 0) {
      this.game.switchToScene(enums.scene.Type.round);
      this.game.roundScene.init();
    } else {
      this.game.end();
    }

    this.clear();
  }

  clear() {
    console.log('CLEAR TRANSITION SCENE');
  }
}
