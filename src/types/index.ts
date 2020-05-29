import { Socket } from 'socket.io';
import { PlayerStatus } from '@colobobo/library';
import { Game, Player } from '@/classes';

export interface RoomInterface {
  id: string;
  players: Map<string, PlayerInterface>;
  game: Game;
  addPlayer: (player: PlayerInterface) => void;
}

export interface PlayerInterface {
  id: string;
  isCreator: boolean;
  socket: Socket;
  status: PlayerStatus;
}

export interface Scene {
  init: () => void;
  playerReady: (player: Player) => void;
  start: () => void;
  end: () => void;
  clear: () => void;
}
