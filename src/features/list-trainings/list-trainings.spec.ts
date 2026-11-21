import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createTraining } from '../../entities/training/training.js';
import { MultiSet } from '../../entities/training/types/types.js';
import { FileTrainingJournal } from '../../infrastructure/file-journal/file-training-journal.js';
import { ListTrainings } from './list-trainings.js';

const multisets: MultiSet[] = [
  {
    sets: [{ exercise: 'Squats', reps: 10, weight: 20 }],
    targetSets: 1,
    duration: 30,
    timeLimit: 60,
    restTime: 60,
  },
];

describe('ListTrainings', () => {
  let dir: string;
  let journalPath: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'progresser-'));
    journalPath = join(dir, 'trainings.jsonl');
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('returns every training stored in the journal', async () => {
    const journal = new FileTrainingJournal(journalPath);
    const training = createTraining(multisets, new Date('2026-11-21'), 'Leg day')!;
    await journal.add(training);

    const listTrainings = new ListTrainings(journal);
    const response = await listTrainings.execute();

    expect(response.trainings).toHaveLength(1);
    expect(response.trainings[0].id).toBe(training.id);
  });

  it('returns an empty list when nothing was created yet', async () => {
    const journal = new FileTrainingJournal(journalPath);
    const listTrainings = new ListTrainings(journal);

    const response = await listTrainings.execute();

    expect(response.trainings).toEqual([]);
  });
});
