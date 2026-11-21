import { Training } from '../../entities/training/types/types.js';
import { TrainingRecord } from './training-record.js';

export const toTrainingRecord = (training: Training): TrainingRecord => ({
  version: 1,
  id: training.id,
  name: training.name,
  multisets: training.multisets,
  targetMultisets: training.targetMultisets,
  date: training.date.toISOString(),
  duration: training.duration,
  timeLimit: training.timeLimit,
});
