import { enums, Members } from '@colobobo/library';

type Step = {
  id: number;
  duration: number;
  elapsedTime: number;
  endType: enums.game.EndType;
  members: Members;
  score: number;
  world: enums.World;
};

export class History {
  steps: Step[] = [];

  push(step: Step) {
    this.steps.push(step);
  }
}
