import { Socket } from 'socket.io';
import { PlayerInterface, PlayerStatus } from '@/types';

export class Player implements PlayerInterface {
  id: string;
  socket: Socket;
  status: PlayerStatus;

  constructor(socket: Socket) {
    this.id = socket.id;
    this.socket = socket;
    this.status = PlayerStatus.active;
  }
}
