import { isDate } from 'node:util/types'
import type { Training, MultiSet, СircuitTraining } from './types/types.js'
import { CIRCUIT_TRAINIG_TYPE } from './types/types.js'

export const createTraining = (
  multisets: MultiSet[],
  date: Date,
  name?: string,
  duration?: number,
  timeLimit?: number,
): Training | undefined => {
  if (multisets.length === 0) {
    // TODO: Throw exception
    return undefined
  }

  let finalDate: Date = new Date()

  // TODO: Date in feature check?
  if (isDate(date)) {
    finalDate = date
  }

  return ({
    id: String(finalDate),
    date: finalDate,
    name: name || String(finalDate).split(' ').slice(1, 4).join(' '),
    multisets,
    timeLimit,
    duration,
  })
}

export const generateTemplateMultisets = (
  multiset: MultiSet,
  totalSets: number,
): MultiSet[] => {
  const multisets: MultiSet[] = []

  for (let i = 0; i <= totalSets; i++) {
    multisets.push(multiset)
  }

  return multisets
}

// multisets: {
//  sets: [
//    { exercise: 'Squats', reps: 10, weight: 20 },
//    { exercise: 'Broad jump', reps: 5, weight: 0 },
//    { exercise: 'Squats', reps: 15, weight: 0 },
//  ],
//  timeLimit: 90,
//  restTime: 60,
// }

export const createEMOMTraining = (
  multisets: MultiSet[],
  date: Date,
  name: string,
  duration?: number,
): СircuitTraining | undefined => {
  if (multisets.length === 0) {
    // TODO: Throw exception
    return undefined
  }

  // All EMOM MultiSets shuld have timeLimit
  if (multisets.some(({ timeLimit }) => !timeLimit)) {
    // TODO: Throw exception
    return undefined
  }

  let finalDate: Date = new Date()

  // TODO: Date in feature check?
  if (isDate(date)) {
    finalDate = date
  }

  return ({
    id: String(finalDate),
    name: name ?? String(finalDate).split(' ').slice(1, 4).join(' '),
    date: finalDate,
    type: CIRCUIT_TRAINIG_TYPE.EMOM,
    multisets,
    duration,
  })
}

// multisets: {
//  sets: [
//    { exercise: 'Squats', reps: 20 },
//    { exercise: 'Push-up', reps: 10 },
//    { exercise: 'Pull-up', reps: 5 },
//  ],
// },
// timeLimit: 1200

export const createAMRAPTraining = (
  multisets: MultiSet[],
  date: Date,
  name: string,
  timeLimit: number
): СircuitTraining | undefined => {
  if (multisets.length === 0) {
    // TODO: Throw exception
    return undefined
  }

  // All AMRAP Training shuld have timeLimit
  if (!timeLimit) {
    // TODO: Throw exception
    return undefined
  }

  let finalDate: Date = new Date()

  // TODO: Date in feature check?
  if (isDate(date)) {
    finalDate = date
  }

  return ({
    id: String(finalDate),
    date: finalDate,
    name: name ?? String(finalDate).split(' ').slice(1, 4).join(' '),
    type: CIRCUIT_TRAINIG_TYPE.AMRAP,
    multisets,
    timeLimit,
  })
}

// multisets: {
//  sets: [
//    { exercise: 'Squats', reps: 20 },
//    { exercise: 'Push-up', reps: 10 },
//    { exercise: 'Pull-up', reps: 5 },
//  ],
// },
// duration: 320

export const createAFAPTraining = (
  multisets: MultiSet[],
  date: Date,
  name: string,
  duration: number
): СircuitTraining | undefined => {
  if (multisets.length === 0) {
    return undefined
  }

  // All AFAP Training shuld have duration
  if (!duration) {
    // TODO: Throw exception
    return undefined
  }

  let finalDate: Date = new Date()

  // TODO: Date in feature check?
  if (isDate(date)) {
    finalDate = date
  }

  return ({
    id: String(finalDate),
    date: finalDate,
    name: name ?? String(finalDate).split(' ').slice(1, 4).join(' '),
    multisets,
    duration,
    type: CIRCUIT_TRAINIG_TYPE.AFAP,
  })
}

// multisets: {
//  sets: [
//    { exercise: 'Squats', reps: 20, weight: 0, timeLimit: 20, restTime: 30 },
//    { exercise: 'Push-up', reps: 20, weight: 0, timeLimit: 20, restTime: 30 },
//  ],
//  restTime: 60,
// }

export const createCircularTraining = (
  multisets: MultiSet[],
  date: Date,
  name: string,
  duration: number
): СircuitTraining | undefined => {
  if (multisets.length === 0) {
    return undefined
  }

  // All CircularTraining MultiSets shuld have restTime
  if (multisets.some(({ restTime }) => !restTime)) {
    // TODO: Throw exception
    return undefined
  }

  // All CircularTraining Sets shuld have timeLimit & restTime
  if (multisets.some(({ sets }) => sets.some(({ timeLimit, restTime }) => !timeLimit || !restTime))) {
    // TODO: Throw exception
    return undefined
  }

  let finalDate: Date = new Date()

  // TODO: Date in feature check?
  if (isDate(date)) {
    finalDate = date
  }

  return ({
    id: String(finalDate),
    date: finalDate,
    name: name ?? String(finalDate).split(' ').slice(1, 4).join(' '),
    type: CIRCUIT_TRAINIG_TYPE.CT,
    multisets,
    duration,
  })
}
