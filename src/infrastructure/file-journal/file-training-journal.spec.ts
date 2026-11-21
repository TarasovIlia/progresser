import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createTraining } from '../../entities/training/training.js';
import { MultiSet } from '../../entities/training/types/types.js';
import { FileTrainingJournal } from './file-training-journal.js';

const multisets: MultiSet[] = [
  {
    sets: [{ exercise: 'Squats', reps: 10, weight: 20 }],
    targetSets: 1,
    duration: 30,
    timeLimit: 60,
    restTime: 60,
  },
];

describe('FileTrainingJournal', () => {
  let dir: string;
  let filePath: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'progresser-'));
    filePath = join(dir, 'nested', 'trainings.jsonl');
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('appends each training as a JSON line with version 1, creating missing directories', async () => {
    const journal = new FileTrainingJournal(filePath);
    const first = createTraining(multisets, new Date('2026-11-21'), 'Leg day')!;
    const second = createTraining(multisets, new Date('2026-11-22'), 'Push day')!;

    await journal.add(first);
    await journal.add(second);

    const lines = (await readFile(filePath, 'utf-8')).trim().split('\n');
    expect(lines).toHaveLength(2);

    const records = lines.map((line) => JSON.parse(line));
    expect(records[0]).toMatchObject({ version: 1, id: first.id, name: 'Leg day' });
    expect(records[1]).toMatchObject({ version: 1, id: second.id, name: 'Push day' });
    expect(typeof records[0].date).toBe('string');
  });
});
