import { BadRequestException, Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateTemplateTrainingResponse } from '../../features/create-template-training/create-template-training-response.js';
import type { CreateTemplateTrainingUseCase } from '../../features/create-template-training/create-template-training-use-case.js';
import { InvalidTemplateTrainingRequestError } from '../../features/create-template-training/invalid-template-training-request-error.js';
import { parseCreateTemplateTrainingRequest } from './parse-create-template-training-request.js';
import { CREATE_TEMPLATE_TRAINING_USE_CASE } from './tokens.js';

@Controller('template-trainings')
export class TemplateTrainingsController {
  constructor(
    @Inject(CREATE_TEMPLATE_TRAINING_USE_CASE)
    private readonly createTemplateTraining: CreateTemplateTrainingUseCase,
  ) {}

  @Post()
  async create(@Body() body: unknown): Promise<CreateTemplateTrainingResponse> {
    const request = parseCreateTemplateTrainingRequest(body);

    try {
      return await this.createTemplateTraining.execute(request);
    } catch (error) {
      if (error instanceof InvalidTemplateTrainingRequestError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
