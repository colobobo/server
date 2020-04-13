import { Area } from '@/classes/Area';
import { Room } from '@/classes';

export class Game {
  room: Room;
  area: Area;

  constructor(room: Room) {
    this.area = new Area(room);
  }

  startGame() {
    console.log('SEND EVENT');
    // TODO: Emit event for all client with ball moving
  }
}
