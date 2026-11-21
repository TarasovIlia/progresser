export class InvalidTrainingRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTrainingRequestError';
  }
}
