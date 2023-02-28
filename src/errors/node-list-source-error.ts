/* eslint-disable max-classes-per-file */
import { ApplicationError } from '@errors/application-error';

export abstract class NodeListSourceError extends ApplicationError {}

export class InvalidResponseFromSource extends NodeListSourceError {
  constructor(url: string, statusCode: number) {
    super();
    this.name = super.name;
    this.message = `${url} - ${statusCode}`;
  }
}

export class NoResponseFromSource extends NodeListSourceError {
  constructor(url: string, errorCode: string) {
    super();
    this.name = super.name;
    this.message = `${url} - ${errorCode}`;
  }
}
