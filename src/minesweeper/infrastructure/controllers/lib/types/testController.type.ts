import request from 'supertest';
import { PublicBoardModel } from '@minesweeper/domain/models';

export interface TestResponse extends request.Response {
  header: {
    'content-type': string;
  };
  body: PublicBoardModel;
}

export interface TestErrorResponse extends request.Response {
  header: {
    'content-type': string;
  };
  body: { message: string };
}
