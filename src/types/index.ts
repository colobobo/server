import { Socket } from 'socket.io';
import { Game } from '@/classes';

export interface RoomInterface {
  id: string;
  players: Map<string, PlayerInterface>;
  game: Game;
  addPlayer: (player: PlayerInterface) => void;
}

export enum PlayerStatus {
  active = 'active',
  absent = 'absent'
}
export interface PlayerInterface {
  id: string;
  socket: Socket;
  status: PlayerStatus;
}
