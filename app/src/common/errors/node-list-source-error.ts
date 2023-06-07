/* eslint-disable max-classes-per-file */
import { ApplicationError } from '@errors/application-error';

export abstract class NodeListSourceError extends ApplicationError {}

export class ProcessingNodeList extends NodeListSourceError {
  constructor() {
    super();
    this.name = super.name;
    this.stack = super.stack;
  }
}
