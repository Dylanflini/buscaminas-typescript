export enum ServerErrorMessages {
  NOT_FOUND = 'route or file not found',
  METHOD_NOT_ALLOWED = 'method not supported',
}

export class ServerError extends Error {
  constructor(public code: number, public message: string) {
    super();
    this.name = 'Server Error';
  }
}
