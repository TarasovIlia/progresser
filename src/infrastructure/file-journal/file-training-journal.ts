import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Training } from '../../entities/training/types/types.js';
import { TrainingJournal } from '../../features/create-training/training-journal.js';
import { toTrainingRecord } from './to-training-record.js';

export class FileTrainingJournal implements TrainingJournal {
  constructor(private readonly filePath: string) {}

  async add(training: Training): Promise<void> {
    const record = toTrainingRecord(training);

    await mkdir(dirname(this.filePath), { recursive: true });
    await appendFile(this.filePath, `${JSON.stringify(record)}\n`, 'utf-8');
  }
}
