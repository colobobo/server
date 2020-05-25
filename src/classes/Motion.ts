import { events, MotionType, payloads } from '@colobobo/library';
import { emitGlobal } from '@/utils';

export class Motion {
  roomId: string;
  type: MotionType;

  constructor(roomId: string, type: MotionType) {
    this.roomId = roomId;
    this.type = type;
  }

  init() {
    console.log('INIT MOTION');
    emitGlobal<payloads.motion.Init>({ roomId: this.roomId, eventName: events.motion.init, data: { type: this.type } });
  }
}
