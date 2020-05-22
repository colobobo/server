import { AreaDevice, Device, events, payloads } from '@colobobo/library';
import { Room } from '@/classes';
import { emitGlobal } from '@/utils';

export class Area {
  room: Room;
  width: Device['width'];
  height: Device['height'];
  devices: Map<string, AreaDevice>;

  constructor(room: Room) {
    this.room = room;
    this.width = 0;
    this.height = 0;
    this.devices = new Map();
  }

  addDeviceToArea(playerId: string, device: Device) {
    this.devices.set(playerId, {
      ...device,
      offsetX: this.width,
      position: this.devices.size,
    });

    this.width += device.width;

    if (this.height === 0 || device.height < this.height) {
      this.height = device.height;
    }

    this.emitAreaUpdate();
  }

  // TODO: Remove with position attribute
  removeDeviceToArea(device: Device) {
    this.emitAreaUpdate();
  }

  emitAreaUpdate() {
    emitGlobal<payloads.area.Update>({
      roomId: this.room.id,
      eventName: events.area.update,
      data: {
        width: this.width,
        height: this.height,
        devices: Array.from(this.devices).reduce(
          (obj, [key, value]) => Object.assign(obj, { [key]: value }), // Be careful! Maps can have non-String keys; object literals can't.
          {},
        ),
      },
    });
  }
}
