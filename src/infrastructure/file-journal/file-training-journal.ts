import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Training } from '../../entities/training/types/types.js';
import { TrainingJournal } from '../../features/create-training/training-journal.js';
import { TrainingReader } from '../../features/list-trainings/training-reader.js';
import { fromTrainingRecord } from './from-training-record.js';
import { toTrainingRecord } from './to-training-record.js';

export class FileTrainingJournal implements TrainingJournal, TrainingReader {
  constructor(private readonly filePath: string) {}

  async add(training: Training): Promise<void> {
    const record = toTrainingRecord(training);

    await mkdir(dirname(this.filePath), { recursive: true });
    await appendFile(this.filePath, `${JSON.stringify(record)}\n`, 'utf-8');
  }

  async getAll(): Promise<Training[]> {
    const content = await this.readFileOrEmpty();

    return content
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => fromTrainingRecord(JSON.parse(line)));
  }

  private async readFileOrEmpty(): Promise<string> {
    try {
      return await readFile(this.filePath, 'utf-8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return '';
      }

      throw error;
    }
  }
}
