import { СircuitTrainingTemplate } from '../../entities/training/types/types.js';

export interface TemplateTrainingJournal {
  add(template: СircuitTrainingTemplate): Promise<void>;
}
