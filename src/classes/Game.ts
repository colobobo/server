import { events } from '@colobobo/library';
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
    this.transitionScene = new TransitionScene(this);
  }

  start() {
    emitGlobal({ roomId: this.room.id, eventName: events.game.startSuccess });
    // TODO: Add global.io.in(this.room.id).emit('game:start:error');

    this.transitionScene.init();

    // Uncomment for working app
    this.roundScene.init();
    this.roundScene.start();
  }

  switchToScene(sceneType: any) {
    this.sceneType = sceneType;
    // TODO: Emit 'scene:update'
  }

  removeLife() {
    this.life = this.life === 0 ? 0 : this.life - 1;
  }

  end() {
    console.log('GAME END');
  }

  kill() {
    console.log('GAME KILLED');
  }
}
