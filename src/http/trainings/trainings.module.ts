import { Module } from '@nestjs/common';
import { CreateTraining } from '../../features/create-training/create-training.js';
import { ListTrainings } from '../../features/list-trainings/list-trainings.js';
import { FileTrainingJournal } from '../../infrastructure/file-journal/file-training-journal.js';
import { CREATE_TRAINING_USE_CASE, LIST_TRAININGS_USE_CASE, TRAINING_JOURNAL } from './tokens.js';
import { TrainingsController } from './trainings.controller.js';

const TRAININGS_JOURNAL_PATH = 'data/trainings.jsonl';

@Module({
  controllers: [TrainingsController],
  providers: [
    {
      provide: TRAINING_JOURNAL,
      useFactory: () => new FileTrainingJournal(TRAININGS_JOURNAL_PATH),
    },
    {
      provide: CREATE_TRAINING_USE_CASE,
      useFactory: (journal: FileTrainingJournal) => new CreateTraining(journal),
      inject: [TRAINING_JOURNAL],
    },
    {
      provide: LIST_TRAININGS_USE_CASE,
      useFactory: (journal: FileTrainingJournal) => new ListTrainings(journal),
      inject: [TRAINING_JOURNAL],
    },
  ],
})
export class TrainingsModule {}
