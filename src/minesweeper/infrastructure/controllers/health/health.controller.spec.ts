import request from 'supertest';
import { createServer } from 'http';
import { requestHandler } from '@minesweeper/infrastructure/server/requestHandler';

describe('health controller', () => {
  it('should return correct data', async () => {
    const server = createServer(requestHandler);

    const response = await request(server).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ status: 'up' });
  });
});
