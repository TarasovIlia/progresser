export interface CreateTemplateTrainingRequest {
  name: string;
  multiset: RequestTemplateMultiSet;
  timeLimit: number;
}

export interface RequestTemplateMultiSet {
  sets: RequestTemplateSet[];
  targetSets?: number;
  timeLimit?: number;
  restTime?: number;
}

export interface RequestTemplateSet {
  exercise: string;
  weight?: number;
  targetReps?: number;
  timeLimit?: number;
  restTime?: number;
}
