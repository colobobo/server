import { Socket } from 'socket.io';
import { PlayerStatus } from '@colobobo/library';
import { PlayerInterface } from '@/types';

export class Player implements PlayerInterface {
  id: string;
  isCreator = false;
  socket: Socket;
  status: PlayerStatus;

  constructor(socket: Socket) {
    this.id = socket.id;
    this.socket = socket;
    this.status = PlayerStatus.active;
  }
}
