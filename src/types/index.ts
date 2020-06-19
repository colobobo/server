import { Socket } from 'socket.io';
import { enums } from '@colobobo/library';
import { Game, Player } from '@/classes';

export interface RoomInterface {
  id: string;
  players: Map<string, PlayerInterface>;
  game: Game;
  addPlayer: (player: PlayerInterface) => void;
  isAdmin: boolean;
}

export interface PlayerInterface {
  id: string;
  isCreator: boolean;
  isReady: boolean;
  socket: Socket;
  status: enums.player.Status;
}
