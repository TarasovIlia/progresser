import { BadRequestException } from '@nestjs/common';
import {
  CreateTemplateTrainingRequest,
  RequestTemplateMultiSet,
  RequestTemplateSet,
} from '../../features/create-template-training/create-template-training-request.js';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isTemplateSet = (value: unknown): value is RequestTemplateSet =>
  isRecord(value) && typeof value.exercise === 'string';

const isTemplateMultiSet = (value: unknown): value is RequestTemplateMultiSet =>
  isRecord(value) && Array.isArray(value.sets) && value.sets.every(isTemplateSet);

export const parseCreateTemplateTrainingRequest = (
  body: unknown,
): CreateTemplateTrainingRequest => {
  if (!isRecord(body)) {
    throw new BadRequestException('Request body must be a JSON object');
  }

  if (typeof body.name !== 'string') {
    throw new BadRequestException('"name" must be a string');
  }

  if (!isTemplateMultiSet(body.multiset)) {
    throw new BadRequestException('"multiset" must be a valid template multiset');
  }

  if (typeof body.timeLimit !== 'number') {
    throw new BadRequestException('"timeLimit" must be a number');
  }

  return {
    name: body.name,
    multiset: body.multiset,
    timeLimit: body.timeLimit,
  };
};
