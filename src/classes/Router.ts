import { events, payloads, Route } from '@colobobo/library';
import { Room } from '@/classes';
import { emitGlobal } from '@/utils';

export class Router {
  room: Room;

  constructor(room: Room) {
    this.room = room;
  }

  push(route: Route) {
    console.log('PUSH TO:', route);
    emitGlobal<payloads.game.RouterUpdate>({
      roomId: this.room.id,
      eventName: events.game.routerUpdate,
      data: { type: route.type },
    });
  }
}
