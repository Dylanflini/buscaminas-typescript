export enum ServerErrorMessages {
  NOT_FOUND = '[Server Error] route or file not found',
}

export class ServerError {
  constructor(public code: number, public message: ServerErrorMessages) {}
}
