import { Module } from '@nestjs/common';
import { CreateTraining } from '../../features/create-training/create-training.js';
import { FileTrainingJournal } from '../../infrastructure/file-journal/file-training-journal.js';
import { CREATE_TRAINING_USE_CASE } from './tokens.js';
import { TrainingsController } from './trainings.controller.js';

const TRAININGS_JOURNAL_PATH = 'data/trainings.jsonl';

@Module({
  controllers: [TrainingsController],
  providers: [
    {
      provide: CREATE_TRAINING_USE_CASE,
      useFactory: () => new CreateTraining(new FileTrainingJournal(TRAININGS_JOURNAL_PATH)),
    },
  ],
})
export class TrainingsModule {}
