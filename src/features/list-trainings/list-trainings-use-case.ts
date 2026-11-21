import { ListTrainingsResponse } from './list-trainings-response.js';

export interface ListTrainingsUseCase {
  execute(): Promise<ListTrainingsResponse>;
}
