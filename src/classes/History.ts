import { round } from '@colobobo/library';

export class History {
  steps: round.EndInformation[] = [];

  push(step: round.EndInformation) {
    this.steps.push(step);
  }
}
