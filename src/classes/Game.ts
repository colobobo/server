import { events, payloads } from 'fast-not-fat';
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
    //
  }

  moveElement = () => {
    const offset = 15;

    if (this.x + offset < this.area.width) {
      this.x = this.x + offset;
    } else {
      this.x = 0;
    }

    global.io.in(this.room.id).emit(events.game.tick, {
      data: {
        x: this.x,
        y: this.area.height / 2,
        tick: gameProperties.tick,
      },
    } as payloads.game.Tick);
  };

  start() {
    global.io.in(this.room.id).emit(events.game.startSuccess);
    // TODO: Add global.io.in(this.room.id).emit('game:start:error');

    this.interval = setInterval(this.moveElement, gameProperties.tick);
  }

  kill() {
    clearInterval(this.interval);
  }
}
