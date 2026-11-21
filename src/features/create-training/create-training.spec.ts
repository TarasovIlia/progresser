import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FileTrainingJournal } from '../../infrastructure/file-journal/file-training-journal.js';
import { CreateTraining } from './create-training.js';
import { CreateTrainingRequest } from './create-training-request.js';
import { InvalidTrainingRequestError } from './invalid-training-request-error.js';

const buildRequest = (
  overrides: Partial<CreateTrainingRequest> = {},
): CreateTrainingRequest => ({
  name: 'Leg day',
  date: new Date('2026-11-21'),
  multisets: [
    {
      sets: [{ exercise: 'Squats', reps: 10, weight: 20 }],
      targetSets: 1,
      duration: 30,
      timeLimit: 60,
      restTime: 60,
    },
  ],
  ...overrides,
});

describe('CreateTraining', () => {
  let dir: string;
  let journalPath: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'progresser-'));
    journalPath = join(dir, 'trainings.jsonl');
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('creates a training and stores it in the journal', async () => {
    const journal = new FileTrainingJournal(journalPath);
    const createTraining = new CreateTraining(journal);

    const response = await createTraining.execute(buildRequest());

    expect(response.message).toBe('Training created');
    expect(response.trainingId).toBeTruthy();

    const lines = (await readFile(journalPath, 'utf-8')).trim().split('\n');
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0]).id).toBe(response.trainingId);
  });

  it('throws when the training violates business rules', async () => {
    const journal = new FileTrainingJournal(journalPath);
    const createTraining = new CreateTraining(journal);

    await expect(
      createTraining.execute(buildRequest({ multisets: [] })),
    ).rejects.toThrow(InvalidTrainingRequestError);

    await expect(readFile(journalPath, 'utf-8')).rejects.toThrow();
  });
});
