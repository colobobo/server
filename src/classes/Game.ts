import { events, MotionType, RoutesTypes } from '@colobobo/library';
import { gameProperties } from '@/config/game-properties';
import { Area, Motion, Room, Round, Router } from '@/classes';
import { emitGlobal } from '@/utils';

export class Game {
  area: Area;
  room: Room;
  round: Round;
  router: Router;
  life: number = gameProperties.life;

  constructor(room: Room) {
    this.area = new Area(room);
    this.room = room;
    this.round = new Round(room, this);
    this.router = new Router(room);
  }

  start() {
    emitGlobal({ roomId: this.room.id, eventName: events.game.startSuccess });
    // TODO: Add global.io.in(this.room.id).emit('game:start:error');

    this.router.push({ type: RoutesTypes.motion });
    new Motion(this.room.id, MotionType.start);

    // this.round.init();
    // this.round.start();
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
