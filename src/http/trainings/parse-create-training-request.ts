import { BadRequestException } from '@nestjs/common';
import {
  CreateTrainingRequest,
  Set,
} from '../../features/create-training/create-training-request.js';

type MultiSetShape = CreateTrainingRequest['multisets'][number];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isSet = (value: unknown): value is Set =>
  isRecord(value) &&
  typeof value.exercise === 'string' &&
  typeof value.reps === 'number' &&
  typeof value.weight === 'number';

const isMultiSet = (value: unknown): value is MultiSetShape =>
  isRecord(value) &&
  Array.isArray(value.sets) &&
  value.sets.every(isSet) &&
  typeof value.targetSets === 'number' &&
  typeof value.duration === 'number' &&
  typeof value.timeLimit === 'number' &&
  typeof value.restTime === 'number';

export const parseCreateTrainingRequest = (body: unknown): CreateTrainingRequest => {
  if (!isRecord(body)) {
    throw new BadRequestException('Request body must be a JSON object');
  }

  if (typeof body.name !== 'string') {
    throw new BadRequestException('"name" must be a string');
  }

  if (!Array.isArray(body.multisets) || !body.multisets.every(isMultiSet)) {
    throw new BadRequestException('"multisets" must be an array of valid multisets');
  }

  const date = new Date(body.date as string);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException('"date" must be a valid date');
  }

  if (body.targetMultisets !== undefined && typeof body.targetMultisets !== 'number') {
    throw new BadRequestException('"targetMultisets" must be a number');
  }

  if (body.duration !== undefined && typeof body.duration !== 'number') {
    throw new BadRequestException('"duration" must be a number');
  }

  if (body.timeLimit !== undefined && typeof body.timeLimit !== 'number') {
    throw new BadRequestException('"timeLimit" must be a number');
  }

  return {
    name: body.name,
    multisets: body.multisets,
    date,
    targetMultisets: body.targetMultisets as number | undefined,
    duration: body.duration as number | undefined,
    timeLimit: body.timeLimit as number | undefined,
  };
};
