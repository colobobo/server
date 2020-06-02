import { enums } from '@colobobo/library';

export const gameProperties = {
  difficulty: {
    step: Object.keys(enums.World).length,
  },
  duration: {
    defaultValue: 30000,
    decreaseCoefficient: 0.95,
  },
  life: 4,
  members: 5,
  players: {
    min: 3,
    max: 6,
  },
  tick: (1000 / 60) * 2,
};
