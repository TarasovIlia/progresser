import { Training } from '../../entities/training/types/types.js';

export interface TrainingJournal {
  add(training: Training): Promise<void>;
}
