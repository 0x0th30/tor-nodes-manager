/* eslint-disable max-classes-per-file */
import { ApplicationError } from '@errors/application';

abstract class NodeListSourceError extends ApplicationError {}

export class UnexpectedResponse extends NodeListSourceError {
  private a: any;

  constructor(status: number, message: string) {
    super();
    super.name = this.constructor.name;
    super.message = `${status}, ${message}`;
  }
}

export class UnavailableSource extends NodeListSourceError {
  constructor(url: string) {
    super();
    super.name = this.constructor.name;
    super.message = `Cannot reach "${url}"`;
  }
}
