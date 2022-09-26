import type { Step } from '../models';

export const getStepById = (
  id: number | boolean,
  flow: Step[]
): Step | undefined =>
  typeof id === 'boolean' ? undefined : flow.find((step) => step.id === id);
