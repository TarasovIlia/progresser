import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('TemplateTrainingsController (e2e)', () => {
  let app: INestApplication<App>;
  let journalDir: string;

  beforeEach(async () => {
    journalDir = await mkdtemp(join(tmpdir(), 'progresser-e2e-'));
    process.env.TEMPLATE_TRAINING_JOURNAL_PATH = join(journalDir, 'template-trainings.jsonl');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    delete process.env.TEMPLATE_TRAINING_JOURNAL_PATH;
    await rm(journalDir, { recursive: true, force: true });
  });

  it('/template-trainings (POST) creates a training template', async () => {
    const response = await request(app.getHttpServer())
      .post('/template-trainings')
      .send({
        name: 'Cindy',
        timeLimit: 1200,
        multiset: {
          sets: [
            { exercise: 'Pull-ups', targetReps: 5 },
            { exercise: 'Push-ups', targetReps: 10 },
            { exercise: 'Air squats', targetReps: 15 },
          ],
        },
      })
      .expect(201);

    expect(response.body.templateId).toBeTruthy();
    expect(response.body.message).toBe('Training template created');
  });

  it('/template-trainings (POST) rejects a business-rule violation with 400', async () => {
    await request(app.getHttpServer())
      .post('/template-trainings')
      .send({
        name: 'Cindy',
        timeLimit: 1200,
        multiset: { sets: [{ exercise: 'Pull-ups' }] },
      })
      .expect(400);
  });

  it('/template-trainings (POST) rejects a malformed body with 400', async () => {
    await request(app.getHttpServer())
      .post('/template-trainings')
      .send({ name: 'Cindy' })
      .expect(400);
  });
});
