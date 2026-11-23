import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { СircuitTrainingTemplate } from '../../entities/training/types/types.js';
import { TemplateTrainingJournal } from '../../features/create-template-training/template-training-journal.js';
import { toTemplateTrainingRecord } from './to-template-training-record.js';

export class FileTemplateTrainingJournal implements TemplateTrainingJournal {
  constructor(private readonly filePath: string) {}

  async add(template: СircuitTrainingTemplate): Promise<void> {
    const record = toTemplateTrainingRecord(template);

    await mkdir(dirname(this.filePath), { recursive: true });
    await appendFile(this.filePath, `${JSON.stringify(record)}\n`, 'utf-8');
  }
}
