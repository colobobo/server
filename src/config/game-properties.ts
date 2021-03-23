import { game } from '@colobobo/library';

export const gameProperties: game.Properties = {
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
    [1]: {
      duration: {
        defaultValue: 400000,
        decreaseCoefficient: 0.95,
      },
      traps: {
        defaultInterval: 8000,
        decreaseCoefficient: 0.98,
      },
    },
    [2]: {
      duration: {
        defaultValue: 600000,
        decreaseCoefficient: 0.95,
      },
      traps: {
        defaultInterval: 5000,
        decreaseCoefficient: 0.98,
      },
    },
    [3]: {
      duration: {
        defaultValue: 20000,
        decreaseCoefficient: 0.95,
      },
      traps: {
        defaultInterval: 2000,
        decreaseCoefficient: 0.98,
      },
    },
    [4]: {
      duration: {
        defaultValue: 50000,
        decreaseCoefficient: 0.95,
      },
      traps: {
        defaultInterval: 5000,
        decreaseCoefficient: 0.98,
      },
    },
    [5]: {
      duration: {
        defaultValue: 55000,
        decreaseCoefficient: 0.95,
      },
      traps: {
        defaultInterval: 5000,
        decreaseCoefficient: 0.98,
      },
    },
    [6]: {
      duration: {
        defaultValue: 60000,
        decreaseCoefficient: 0.95,
      },
      traps: {
        defaultInterval: 5000,
        decreaseCoefficient: 0.98,
      },
    },
  },
};
