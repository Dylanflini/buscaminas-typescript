import request from 'supertest';
import { createServer } from 'http';
import { requestHandler } from '@minesweeper/infrastructure/server/requestHandler';
import { ServerErrorMessages } from './utils/validations';

describe('api server', () => {
  it('should return Not Found error if file or route not exists', async () => {
    const server = createServer(requestHandler);

    const res = await request(server).get('/file-not-exists');

    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({ message: ServerErrorMessages.NOT_FOUND });
  });

  it.todo('should return Internal Server Error');
});
