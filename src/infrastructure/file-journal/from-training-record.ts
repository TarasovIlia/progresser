import { Training } from '../../entities/training/types/types.js';
import { TrainingRecord } from './training-record.js';

export const fromTrainingRecord = (record: TrainingRecord): Training => ({
  id: record.id,
  name: record.name,
  multisets: record.multisets,
  targetMultisets: record.targetMultisets,
  date: new Date(record.date),
  duration: record.duration,
  timeLimit: record.timeLimit,
});
