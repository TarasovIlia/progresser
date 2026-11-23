import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createAMRAPTrainingTemplate } from '../../entities/training/template-training.js';
import { TemplateMultiSet } from '../../entities/training/types/types.js';
import { FileTemplateTrainingJournal } from './file-template-training-journal.js';

const multiset: TemplateMultiSet = {
  sets: [
    { exercise: 'Pull-ups', targetReps: 5 },
    { exercise: 'Push-ups', targetReps: 10 },
    { exercise: 'Air squats', targetReps: 15 },
  ],
};

describe('FileTemplateTrainingJournal', () => {
  let dir: string;
  let filePath: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'progresser-'));
    filePath = join(dir, 'nested', 'template-trainings.jsonl');
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('appends the template as a JSON line with version 1, creating missing directories', async () => {
    const journal = new FileTemplateTrainingJournal(filePath);
    const template = createAMRAPTrainingTemplate(multiset, 'Cindy', 1200)!;

    await journal.add(template);

    const lines = (await readFile(filePath, 'utf-8')).trim().split('\n');
    expect(lines).toHaveLength(1);

    const record = JSON.parse(lines[0]);
    expect(record).toMatchObject({ version: 1, id: template.id, name: 'Cindy', type: 'armrap' });
  });
});
