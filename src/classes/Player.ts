import { Socket } from 'socket.io';
import { enums } from '@colobobo/library';
import { PlayerInterface } from '@/types';

export class Player implements PlayerInterface {
  id: string;
  isCreator = false;
  isReady = false;
  socket: Socket;
  status: enums.player.Status;

  constructor(socket: Socket) {
    this.id = socket.id;
    this.socket = socket;
    this.status = enums.player.Status.active;
  }
}
