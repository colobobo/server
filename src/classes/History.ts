import { enums, round } from '@colobobo/library';

export class History {
  steps: round.EndInformation[] = [];

  push(step: round.EndInformation) {
    this.steps.push(step);
  }

  get isLastRoundSuccess(): boolean {
    if (this.steps.length === 0) return false;
    return this.steps[this.steps.length - 1].endType === enums.round.EndType.success;
  }
}
