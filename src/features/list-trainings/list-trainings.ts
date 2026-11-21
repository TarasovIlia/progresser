import { ListTrainingsResponse } from './list-trainings-response.js';
import { ListTrainingsUseCase } from './list-trainings-use-case.js';
import { TrainingReader } from './training-reader.js';

export class ListTrainings implements ListTrainingsUseCase {
  constructor(private readonly reader: TrainingReader) {}

  async execute(): Promise<ListTrainingsResponse> {
    const trainings = await this.reader.getAll();

    return { trainings };
  }
}
