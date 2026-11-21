export interface CreateTrainingRequest {
  name: string;
  multisets: RequestMultiSet[];
  targetMultisets?: number;
  date: Date;
  duration?: number;
  timeLimit?: number;
}

export interface RequestMultiSet {
  sets: RequestSet[];
  targetSets: number;
  duration: number;
  timeLimit: number;
  restTime: number;
}

export interface RequestSet {
  exercise: string;
  reps: number;
  weight: number;
  targetReps?: number;
  duration?: number;
  timeLimit?: number;
  restTime?: number;
}
