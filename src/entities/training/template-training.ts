import { randomUUID } from 'node:crypto';
import type { TemplateMultiSet, СircuitTrainingTemplate } from './types/types.js';
import { CIRCUIT_TRAINIG_TYPE } from './types/types.js';

export const createAMRAPTrainingTemplate = (
  multiset: TemplateMultiSet,
  name: string,
  timeLimit: number,
): СircuitTrainingTemplate | undefined => {
  if (multiset.sets.length === 0) {
    // TODO: Throw exception
    return undefined;
  }

  // All AMRAP TrainingTemplate shuld have timeLimit
  if (!timeLimit) {
    // TODO: Throw exception
    return undefined;
  }

  // All AMRAP TrainingTemplate sets shuld have targetReps
  if (multiset.sets.some(({ targetReps }) => !targetReps)) {
    // TODO: Throw exception
    return undefined;
  }

  return {
    id: randomUUID(),
    name: name,
    type: CIRCUIT_TRAINIG_TYPE.AMRAP,
    multiset,
    timeLimit,
  };
};
