import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FileTemplateTrainingJournal } from '../../infrastructure/file-journal/file-template-training-journal.js';
import { CreateTemplateTraining } from './create-template-training.js';
import { CreateTemplateTrainingRequest } from './create-template-training-request.js';
import { InvalidTemplateTrainingRequestError } from './invalid-template-training-request-error.js';

const buildRequest = (
  overrides: Partial<CreateTemplateTrainingRequest> = {},
): CreateTemplateTrainingRequest => ({
  name: 'Cindy',
  timeLimit: 1200,
  multiset: {
    sets: [
      { exercise: 'Pull-ups', targetReps: 5 },
      { exercise: 'Push-ups', targetReps: 10 },
      { exercise: 'Air squats', targetReps: 15 },
    ],
  },
  ...overrides,
});

describe('CreateTemplateTraining', () => {
  let dir: string;
  let journalPath: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'progresser-'));
    journalPath = join(dir, 'template-trainings.jsonl');
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('creates a training template and stores it in the journal', async () => {
    const journal = new FileTemplateTrainingJournal(journalPath);
    const createTemplateTraining = new CreateTemplateTraining(journal);

    const response = await createTemplateTraining.execute(buildRequest());

    expect(response.message).toBe('Training template created');
    expect(response.templateId).toBeTruthy();

    const lines = (await readFile(journalPath, 'utf-8')).trim().split('\n');
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0]).id).toBe(response.templateId);
  });

  it('throws when a set is missing targetReps', async () => {
    const journal = new FileTemplateTrainingJournal(journalPath);
    const createTemplateTraining = new CreateTemplateTraining(journal);

    await expect(
      createTemplateTraining.execute(
        buildRequest({ multiset: { sets: [{ exercise: 'Pull-ups' }] } }),
      ),
    ).rejects.toThrow(InvalidTemplateTrainingRequestError);

    await expect(readFile(journalPath, 'utf-8')).rejects.toThrow();
  });

  it('throws when timeLimit is missing', async () => {
    const journal = new FileTemplateTrainingJournal(journalPath);
    const createTemplateTraining = new CreateTemplateTraining(journal);

    await expect(
      createTemplateTraining.execute(buildRequest({ timeLimit: 0 })),
    ).rejects.toThrow(InvalidTemplateTrainingRequestError);
  });
});
