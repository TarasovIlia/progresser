import { Module } from '@nestjs/common';
import { CreateTemplateTraining } from '../../features/create-template-training/create-template-training.js';
import { FileTemplateTrainingJournal } from '../../infrastructure/file-journal/file-template-training-journal.js';
import { CREATE_TEMPLATE_TRAINING_USE_CASE, TEMPLATE_TRAINING_JOURNAL } from './tokens.js';
import { TemplateTrainingsController } from './template-trainings.controller.js';

@Module({
  controllers: [TemplateTrainingsController],
  providers: [
    {
      provide: TEMPLATE_TRAINING_JOURNAL,
      useFactory: () =>
        new FileTemplateTrainingJournal(
          process.env.TEMPLATE_TRAINING_JOURNAL_PATH ?? 'data/template-trainings.jsonl',
        ),
    },
    {
      provide: CREATE_TEMPLATE_TRAINING_USE_CASE,
      useFactory: (journal: FileTemplateTrainingJournal) => new CreateTemplateTraining(journal),
      inject: [TEMPLATE_TRAINING_JOURNAL],
    },
  ],
})
export class TemplateTrainingsModule {}
