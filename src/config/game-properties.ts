export const gameProperties = {
  difficultyStep: 3,
  lives: 4,
  members: {
    min: 2,
    max: 5,
  },
  players: { min: 3, max: 6 },
  tick: (1000 / 60) * 2,
  variables: {
    duration: {
      defaultValue: 30000,
      decreaseCoefficient: 0.95,
    },
    traps: {
      defaultInterval: 5000,
      decreaseCoefficient: 0.98,
    },
  },
};
