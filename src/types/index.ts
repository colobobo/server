import { Socket } from 'socket.io';
import { PlayerStatus } from '@colobobo/library';
import { Game } from '@/classes';

export interface RoomInterface {
  id: string;
  players: Map<string, PlayerInterface>;
  game: Game;
  addPlayer: (player: PlayerInterface) => void;
}

export interface PlayerInterface {
  id: string;
  socket: Socket;
  status: PlayerStatus;
}
