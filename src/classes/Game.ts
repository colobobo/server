import { enums, events, payloads } from '@colobobo/library';
import { gameProperties } from '@/config/game-properties';
import { Area, Room, RoundScene, TransitionScene } from '@/classes';
import { emitGlobal } from '@/utils';

export class Game {
  area: Area;
  room: Room;
  sceneType: enums.scene.Type;
  roundScene: RoundScene;
  transitionScene: TransitionScene;
  score = 0;
  lives: number = gameProperties.lives;

  constructor(room: Room) {
    this.area = new Area(room);
    this.room = room;
    this.roundScene = new RoundScene(this.room, this);
    this.transitionScene = new TransitionScene(this.room, this);
  }

  start() {
    console.log(events.game.startSuccess);
    emitGlobal<payloads.game.StartSuccess>({
      roomId: this.room.id,
      eventName: events.game.startSuccess,
      data: {
        lives: this.lives,
      },
    });

    // TODO: Add global.io.in(this.room.id).emit('game:start:error');

    this.switchToScene(enums.scene.Type.transition);
    this.transitionScene.init();
  }

  validateDisposition(payload: payloads.game.DispositionSelected) {
    emitGlobal<payloads.game.DispositionValidated>({
      roomId: this.room.id,
      eventName: events.game.dispositionValidated,
      data: { disposition: payload.disposition },
    });
  }

  switchToScene(sceneType: enums.scene.Type) {
    console.log(events.game.sceneTypeUpdate);
    this.sceneType = sceneType;
    emitGlobal<payloads.game.SceneTypeUpdate>({
      roomId: this.room.id,
      eventName: events.game.sceneTypeUpdate,
      data: {
        type: sceneType,
      },
    });
  }

  end() {
    console.log(events.game.end);
    // TODO: Add roundScene history
    emitGlobal<payloads.game.End>({ roomId: this.room.id, eventName: events.game.end });
  }

  kill() {
    console.log('GAME KILLED');
  }
}
