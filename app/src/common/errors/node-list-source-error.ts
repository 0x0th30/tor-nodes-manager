/* eslint-disable max-classes-per-file */
import { ApplicationError } from '@errors/application-error';

export abstract class NodeListSourceError extends ApplicationError {
  public info!: { url: string; status?: number; code?: string; };
}

export class InvalidResponseFromSource extends NodeListSourceError {
  constructor(url: string, statusCode: number) {
    super();
    this.name = super.name;
    this.message = `${url} - ${statusCode}`;
    this.info = { url, status: statusCode };
  }
}

export class NoResponseFromSource extends NodeListSourceError {
  constructor(url: string, errorCode: string) {
    super();
    this.name = super.name;
    this.message = `${url} - ${errorCode}`;
    this.info = { url, code: errorCode };
  }
}
