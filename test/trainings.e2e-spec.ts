import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('TrainingsController (e2e)', () => {
  let app: INestApplication<App>;
  let journalDir: string;

  beforeEach(async () => {
    journalDir = await mkdtemp(join(tmpdir(), 'progresser-e2e-'));
    process.env.TRAINING_JOURNAL_PATH = join(journalDir, 'trainings.jsonl');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    delete process.env.TRAINING_JOURNAL_PATH;
    await rm(journalDir, { recursive: true, force: true });
  });

  it('/trainings (POST) creates a training', async () => {
    const response = await request(app.getHttpServer())
      .post('/trainings')
      .send({
        name: 'Leg day',
        date: '2026-11-21',
        multisets: [
          {
            sets: [{ exercise: 'Squats', reps: 10, weight: 20 }],
            targetSets: 1,
            duration: 30,
            timeLimit: 60,
            restTime: 60,
          },
        ],
      })
      .expect(201);

    expect(response.body.trainingId).toBeTruthy();
    expect(response.body.message).toBe('Training created');
  });

  it('/trainings (POST) generates a date when none is provided', async () => {
    const response = await request(app.getHttpServer())
      .post('/trainings')
      .send({
        name: 'Leg day',
        multisets: [
          {
            sets: [{ exercise: 'Squats', reps: 10, weight: 20 }],
            targetSets: 1,
            duration: 30,
            timeLimit: 60,
            restTime: 60,
          },
        ],
      })
      .expect(201);

    expect(response.body.trainingId).toBeTruthy();

    const list = await request(app.getHttpServer()).get('/trainings').expect(200);
    expect(list.body.trainings[0].date).toBeTruthy();
  });

  it('/trainings (POST) rejects a business-rule violation with 400', async () => {
    await request(app.getHttpServer())
      .post('/trainings')
      .send({ name: 'Leg day', date: '2026-11-21', multisets: [] })
      .expect(400);
  });

  it('/trainings (POST) rejects a malformed body with 400', async () => {
    await request(app.getHttpServer())
      .post('/trainings')
      .send({ name: 'Leg day' })
      .expect(400);
  });

  it('/trainings (GET) returns an empty list when nothing was created', async () => {
    const response = await request(app.getHttpServer()).get('/trainings').expect(200);

    expect(response.body.trainings).toEqual([]);
  });

  it('/trainings (GET) returns every created training', async () => {
    await request(app.getHttpServer())
      .post('/trainings')
      .send({
        name: 'Leg day',
        date: '2026-11-21',
        multisets: [
          {
            sets: [{ exercise: 'Squats', reps: 10, weight: 20 }],
            targetSets: 1,
            duration: 30,
            timeLimit: 60,
            restTime: 60,
          },
        ],
      })
      .expect(201);

    const response = await request(app.getHttpServer()).get('/trainings').expect(200);

    expect(response.body.trainings).toHaveLength(1);
    expect(response.body.trainings[0].name).toBe('Leg day');
  });
});
