import { CreateTrainingRequest } from './create-training-request.js';
import { CreateTrainingResponse } from './create-training-response.js';

export interface CreateTrainingUseCase {
  execute(request: CreateTrainingRequest): Promise<CreateTrainingResponse>;
}
