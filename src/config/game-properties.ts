import { GameProperties } from '@/types';

export const gameProperties: GameProperties = {
  difficultyStep: 3,
  lives: 4,
  members: { min: 2, max: 5 },
  players: { min: 3, max: 6 },
  tick: (1000 / 60) * 2,
  score: {
    memberArrived: 20,
    memberTrapped: -5,
  },
  variables: {
    [3]: {
      duration: {
        defaultValue: 45000,
        decreaseCoefficient: 0.95,
      },
      traps: {
        defaultInterval: 12000,
        decreaseCoefficient: 0.98,
      },
    },
    [4]: {
      duration: {
        defaultValue: 50000,
        decreaseCoefficient: 0.95,
      },
      traps: {
        defaultInterval: 12000,
        decreaseCoefficient: 0.98,
      },
    },
    [5]: {
      duration: {
        defaultValue: 55000,
        decreaseCoefficient: 0.95,
      },
      traps: {
        defaultInterval: 12000,
        decreaseCoefficient: 0.98,
      },
    },
    [6]: {
      duration: {
        defaultValue: 60000,
        decreaseCoefficient: 0.95,
      },
      traps: {
        defaultInterval: 12000,
        decreaseCoefficient: 0.98,
      },
    },
  },
};
