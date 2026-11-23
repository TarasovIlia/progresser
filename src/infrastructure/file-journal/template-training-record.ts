import { CIRCUIT_TRAINIG_TYPE, TemplateMultiSet } from '../../entities/training/types/types.js';

export interface TemplateTrainingRecord {
  version: 1;
  id: string;
  name: string;
  type: CIRCUIT_TRAINIG_TYPE;
  multiset: TemplateMultiSet;
  targetMultisets?: number;
  timeLimit?: number;
}
