import { randomUUID } from 'node:crypto';
import type {
  TemplateMultiSet,
  СircuitTrainingTemplate,
} from './types/types.js';
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

export const createEMOMTrainingTemplate = (
  multiset: TemplateMultiSet,
  name: string,
): СircuitTrainingTemplate | undefined => {
  if (multiset.sets.length === 0) {
    // TODO: Throw exception
    return undefined;
  }

  // All EMOMT TrainingTemplate sets shuld have targetReps
  if (multiset.sets.some(({ targetReps }) => !targetReps)) {
    // TODO: Throw exception
    return undefined;
  }

  // All EMOM TrainingTemplate multiset or sets shuld contain timeLimit & restTime
  const multisetHasTiming = Boolean(multiset.timeLimit && multiset.restTime !== undefined);
  const allSetsHaveTiming = multiset.sets.every(
    ({ timeLimit, restTime }) => timeLimit && restTime !== undefined,
  );

  // All EMOM TrainingTemplate multiset or sets should contain timeLimit & restTime
  if (!multisetHasTiming && !allSetsHaveTiming) {
    // TODO: Throw exception
    return undefined;
  }

  return {
    id: randomUUID(),
    name: name,
    type: CIRCUIT_TRAINIG_TYPE.EMOM,
    multiset,
  };
};
