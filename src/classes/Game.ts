import { EventsGame, PayloadsGame } from 'fast-not-fat';
import { Area } from '@/classes/Area';
import { Room } from '@/classes';
import { gameProperties } from '@/config/game-properties';

export class Game {
  room: Room;
  area: Area;
  interval: any;
  x: number;

  constructor(room: Room) {
    this.room = room;
    this.area = new Area(room);
    this.init();
  }

  init() {
    this.interval = setInterval(this.moveElement, gameProperties.tick);
  }

  moveElement = () => {
    const offset = 2;

    if (this.x + offset < this.area.width) {
      this.x = this.x + offset;
    } else {
      this.x = 0;
    }

    global.io.in(this.room.id).emit(EventsGame.tick, {
      data: { x: this.x, y: this.area.height / 2 }
    } as PayloadsGame.Tick);
  };

  start() {
    global.io.in(this.room.id).emit(EventsGame.startSuccess);
    // TODO: Add global.io.in(this.room.id).emit('game:start:error');
  }

  kill() {
    clearInterval(this.interval);
  }
}
