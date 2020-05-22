import { events, payloads, GameObjects } from '@colobobo/library';
import { Area } from '@/classes';
import { Room } from '@/classes';
import { gameProperties } from '@/config/game-properties';
import { emitGlobal } from '@/utils';

export class Game {
  room: Room;
  area: Area;
  interval: any;
  x: number;
  y: number;
  objects: GameObjects;

  constructor(room: Room) {
    this.room = room;
    this.area = new Area(room);
    this.init();
  }

  init() {
    this.objects = {
      'object-1': {
        x: 0,
        y: 0,
        width: 180,
        height: 180,
        color: '#ffe136',
      },
      'object-2': {
        x: 0,
        y: 150,
        width: 130,
        height: 130,
        color: '#ff7ade',
      },
      'object-3': {
        x: 0,
        y: 250,
        width: 100,
        height: 100,
        color: '#3ced7e',
      },
    };
  }

  updatePosition({ x, y, id }: { x: number; y: number; id: string }) {
    this.objects[id].x = x;
    this.objects[id].y = y;
  }

  tick() {
    emitGlobal<payloads.game.Tick>({
      roomId: this.room.id,
      eventName: events.game.tick,
      data: {
        objects: this.objects,
        tick: gameProperties.tick,
      },
    });
  }

  start() {
    this.interval = setInterval(this.tick.bind(this), gameProperties.tick);
    emitGlobal({ roomId: this.room.id, eventName: events.game.startSuccess });
    // TODO: Add global.io.in(this.room.id).emit('game:start:error');
  }

  kill() {
    clearInterval(this.interval);
  }
}
