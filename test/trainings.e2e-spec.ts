import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { rm } from 'node:fs/promises';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

const JOURNAL_PATH = 'data/trainings.jsonl';

describe('TrainingsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await rm(JOURNAL_PATH, { force: true });
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
