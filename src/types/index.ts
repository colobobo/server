import { Socket } from 'socket.io';
import { enums } from '@colobobo/library';
import { Game } from '@/classes';

export interface GameProperties {
  difficultyStep: number;
  lives: number;
  members: {
    min: number;
    max: number;
  };
  players: {
    min: number;
    max: number;
  };
  tick: number;
  score: {
    memberArrived: number;
    memberTrapped: number;
  };
  variables: {
    [playerNumber: number]: {
      duration: {
        defaultValue: number;
        decreaseCoefficient: number;
      };
      traps: {
        defaultInterval: number;
        decreaseCoefficient: number;
      };
    };
  };
}

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
