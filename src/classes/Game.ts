import { enums, events, payloads } from '@colobobo/library';
import { gameProperties } from '@/config/game-properties';
import { Area, Room, RoundScene, TransitionScene } from '@/classes';
import { emitGlobal } from '@/utils';

export class Game {
  area: Area;
  room: Room;
  sceneType: any; // TODO: type
  roundScene: RoundScene;
  transitionScene: TransitionScene;
  score = 0;
  life: number = gameProperties.life;

  constructor(room: Room) {
    this.area = new Area(room);
    this.room = room;
    this.roundScene = new RoundScene(this.room, this);
    this.transitionScene = new TransitionScene(this.room, this);
  }

  start() {
    console.log(events.game.startSuccess);
    emitGlobal<payloads.game.StartSuccess>({ roomId: this.room.id, eventName: events.game.startSuccess });
    // TODO: Add global.io.in(this.room.id).emit('game:start:error');

    this.transitionScene.init();

    // Uncomment for working app
    // this.roundScene.init();
    // this.roundScene.start();
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

  removeLife() {
    this.life = this.life === 0 ? 0 : this.life - 1;
  }

  end() {
    console.log(events.game.end);
    emitGlobal<payloads.game.End>({ roomId: this.room.id, eventName: events.game.end });
  }

  kill() {
    console.log('GAME KILLED');
  }
}
