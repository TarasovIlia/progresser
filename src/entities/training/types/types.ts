export enum CIRCUIT_TRAINIG_TYPE {
  AMRAP = 'armrap',
  EMOM = 'emom',
  CT = 'circular_trainig',
  AFAP = 'afap'
}

export interface Set {
  exercise: string
  reps: number
  weight: number
  duration?:number
  timeLimit?: number
  restTime?: number
}

export interface MultiSet {
  sets: Set[]
  duration: number
  timeLimit: number
  restTime: number
}

export interface СircuitTraining extends Training {
  type: CIRCUIT_TRAINIG_TYPE
}

export interface Training {
  id: string
  name: string
  multisets: MultiSet[]
  date: Date
  duration?: number
  timeLimit?: number
}
