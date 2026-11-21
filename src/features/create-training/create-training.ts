import { createTraining } from '../../entities/training/training.js';
import { CreateTrainingRequest } from './create-training-request.js';
import { CreateTrainingResponse } from './create-training-response.js';
import { CreateTrainingUseCase } from './create-training-use-case.js';
import { InvalidTrainingRequestError } from './invalid-training-request-error.js';
import { TrainingJournal } from './training-journal.js';

export class CreateTraining implements CreateTrainingUseCase {
  constructor(private readonly journal: TrainingJournal) {}

  async execute(request: CreateTrainingRequest): Promise<CreateTrainingResponse> {
    const training = createTraining(
      request.multisets,
      request.date,
      request.name,
      request.duration,
      request.timeLimit,
    );

    if (!training) {
      throw new InvalidTrainingRequestError('Training violates business rules');
    }

    await this.journal.add(training);

    return {
      trainingId: training.id,
      message: 'Training created',
    };
  }
}
