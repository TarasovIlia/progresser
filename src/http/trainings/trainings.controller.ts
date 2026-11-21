import { BadRequestException, Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CreateTrainingResponse } from '../../features/create-training/create-training-response.js';
import type { CreateTrainingUseCase } from '../../features/create-training/create-training-use-case.js';
import { InvalidTrainingRequestError } from '../../features/create-training/invalid-training-request-error.js';
import { ListTrainingsResponse } from '../../features/list-trainings/list-trainings-response.js';
import type { ListTrainingsUseCase } from '../../features/list-trainings/list-trainings-use-case.js';
import { parseCreateTrainingRequest } from './parse-create-training-request.js';
import { CREATE_TRAINING_USE_CASE, LIST_TRAININGS_USE_CASE } from './tokens.js';

@Controller('trainings')
export class TrainingsController {
  constructor(
    @Inject(CREATE_TRAINING_USE_CASE)
    private readonly createTraining: CreateTrainingUseCase,
    @Inject(LIST_TRAININGS_USE_CASE)
    private readonly listTrainings: ListTrainingsUseCase,
  ) {}

  @Post()
  async create(@Body() body: unknown): Promise<CreateTrainingResponse> {
    const request = parseCreateTrainingRequest(body);

    try {
      return await this.createTraining.execute(request);
    } catch (error) {
      if (error instanceof InvalidTrainingRequestError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get()
  async findAll(): Promise<ListTrainingsResponse> {
    return this.listTrainings.execute();
  }
}
