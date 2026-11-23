import { createAMRAPTrainingTemplate } from '../../entities/training/template-training.js';
import { CreateTemplateTrainingRequest } from './create-template-training-request.js';
import { CreateTemplateTrainingResponse } from './create-template-training-response.js';
import { CreateTemplateTrainingUseCase } from './create-template-training-use-case.js';
import { InvalidTemplateTrainingRequestError } from './invalid-template-training-request-error.js';
import { TemplateTrainingJournal } from './template-training-journal.js';

export class CreateTemplateTraining implements CreateTemplateTrainingUseCase {
  constructor(private readonly journal: TemplateTrainingJournal) {}

  async execute(
    request: CreateTemplateTrainingRequest,
  ): Promise<CreateTemplateTrainingResponse> {
    const template = createAMRAPTrainingTemplate(request.multiset, request.name, request.timeLimit);

    if (!template) {
      throw new InvalidTemplateTrainingRequestError('Training template violates business rules');
    }

    await this.journal.add(template);

    return {
      templateId: template.id,
      message: 'Training template created',
    };
  }
}
