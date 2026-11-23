export class InvalidTemplateTrainingRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTemplateTrainingRequestError';
  }
}
