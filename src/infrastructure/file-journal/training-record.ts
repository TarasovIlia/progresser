import { MultiSet } from '../../entities/training/types/types.js';

export interface TrainingRecord {
  version: 1;
  id: string;
  name: string;
  multisets: MultiSet[];
  targetMultisets?: number;
  date: string;
  duration?: number;
  timeLimit?: number;
}
