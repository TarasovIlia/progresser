export enum CIRCUIT_TRAINIG_TYPE {
  AMRAP = 'armrap',
  EMOM = 'emom',
  CT = 'circular_trainig',
  AFAP = 'afap',
}

export interface TemplateSet {
  exercise: string;
  weight?: number;
  targetReps?: number;
  timeLimit?: number;
  restTime?: number;
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

export interface TemplateMultiSet {
  sets: TemplateSet[];
  timeLimit?: number;
  targetSets?: number;
  restTime?: number;
}

export interface MultiSet {
  sets: Set[];
  targetSets: number;
  duration: number;
  timeLimit: number;
  restTime: number;
}

export interface СircuitTraining extends Training {
  type: CIRCUIT_TRAINIG_TYPE;
}

export interface Training {
  id: string;
  name: string;
  multisets: MultiSet[];
  targetMultisets?: number;
  date: Date;
  duration?: number;
  timeLimit?: number;
}

export interface СircuitTrainingTemplate {
  id: string;
  name: string;
  multiset: TemplateMultiSet;
  targetMultisets?: number;
  type: CIRCUIT_TRAINIG_TYPE;
  timeLimit?: number;
}
