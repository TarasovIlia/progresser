import { СircuitTrainingTemplate } from '../../entities/training/types/types.js';
import { TemplateTrainingRecord } from './template-training-record.js';

export const toTemplateTrainingRecord = (
  template: СircuitTrainingTemplate,
): TemplateTrainingRecord => ({
  version: 1,
  id: template.id,
  name: template.name,
  type: template.type,
  multiset: template.multiset,
  targetMultisets: template.targetMultisets,
  timeLimit: template.timeLimit,
});
