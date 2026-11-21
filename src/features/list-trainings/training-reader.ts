import { Training } from '../../entities/training/types/types.js';

export interface TrainingReader {
  getAll(): Promise<Training[]>;
}
