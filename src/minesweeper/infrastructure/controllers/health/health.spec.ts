import request from 'supertest';
import { createServer } from 'http';
import { requestHandler } from '@minesweeper/infrastructure/server/requestHandler';

describe('health controller', () => {
  it('should return correct data', async () => {
    const server = createServer(requestHandler);

    const res = await request(server).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({ status: 'up' });
  });
});
