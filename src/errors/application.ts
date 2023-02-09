/* eslint-disable max-classes-per-file */
export abstract class ApplicationError extends Error {}

export class RequestFail extends ApplicationError {
  constructor() {
    super();
    super.name = this.constructor.name;
  }
}
