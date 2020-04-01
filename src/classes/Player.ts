import { Device } from 'fast-not-fat';
import { Socket } from 'socket.io';
import { PlayerInterface, PlayerStatus } from '@/types';

export class Player implements PlayerInterface {
  id: string;
  clientSocket: Socket;
  socket: Socket;
  status: PlayerStatus;
  device: Device;

  constructor(socket: Socket, device: Device) {
    this.id = socket.id;
    this.clientSocket = socket;
    this.socket = socket;
    this.status = PlayerStatus.active;
    this.device = device;
  }
}
