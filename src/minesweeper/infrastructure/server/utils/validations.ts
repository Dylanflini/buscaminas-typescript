export enum ServerErrorMessages {
  NOT_FOUND = 'route or file not found',
}

export class ServerError extends Error {
  constructor(public code: number, public message: string) {
    super();
    this.name = 'Server Error';
  }
}
