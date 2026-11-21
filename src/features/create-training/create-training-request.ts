export interface CreateTrainingRequest {
  name: string;
  multisets: MultiSet[];
  targetMultisets?: number;
  date: Date;
  duration?: number;
  timeLimit?: number;
}

interface MultiSet {
  sets: Set[];
  targetSets: number;
  duration: number;
  timeLimit: number;
  restTime: number;
}

export interface Set {
  exercise: string;
  reps: number;
  weight: number;
  targetReps?: number;
  duration?: number;
  timeLimit?: number;
  restTime?: number;
}
