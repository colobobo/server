import { Socket } from 'socket.io';
import { Device } from 'fast-not-fat';

export interface RoomInterface {
  id: string;
  socket: Socket;
  players: Map<string, PlayerInterface>;
  addPlayer: (player: PlayerInterface) => void;
}

export enum PlayerStatus {
  active = 'active',
  absent = 'absent'
}
export interface PlayerInterface {
  id: string;
  clientSocket: Socket;
  socket: Socket;
  status: PlayerStatus;
  device: Device;
}
