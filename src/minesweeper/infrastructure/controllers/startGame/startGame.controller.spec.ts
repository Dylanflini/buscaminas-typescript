import request from 'supertest';
import { createServer } from 'http';
import { requestHandler } from '@minesweeper/infrastructure/server/requestHandler';

describe('start game controller', () => {
  it('should return correct data', async () => {
    const server = createServer(requestHandler);

    const response = await request(server).get('/start?bombs=1&rows=2&columns=2');

    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.id).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.cells).toStrictEqual([
      { position: [0, 0], isExposed: false },
      { position: [1, 0], isExposed: false },
      { position: [0, 1], isExposed: false },
      { position: [1, 1], isExposed: false },
    ]);
  });

  it('should return Bad Request error if client send wrong data', async () => {
    const server = createServer(requestHandler);

    const response = await request(server).get('/start?bombs=1&rows=0&columns=2');

    expect(response.statusCode).toBe(400);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.message).toBeTruthy();
  });
});
