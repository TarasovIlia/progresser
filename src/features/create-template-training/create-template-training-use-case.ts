import { CreateTemplateTrainingRequest } from './create-template-training-request.js';
import { CreateTemplateTrainingResponse } from './create-template-training-response.js';

export interface CreateTemplateTrainingUseCase {
  execute(request: CreateTemplateTrainingRequest): Promise<CreateTemplateTrainingResponse>;
}
