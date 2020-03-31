import { Device } from 'fast-not-fat';
import { Socket } from 'socket.io';
import { PlayerInterface, PlayerStatus } from '@/types';

export class Player implements PlayerInterface {
  id: string;
  clientSocket: Socket;
  socket: Socket;
  status: PlayerStatus;
  device: Device;

  constructor(clientSocket: Socket, socket: Socket, device: Device) {
    this.id = clientSocket.id;
    this.clientSocket = clientSocket;
    this.socket = socket;
    this.status = PlayerStatus.active;
    this.device = device;
  }
}
