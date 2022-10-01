import request from 'supertest';
import { createServer } from 'http';
import { requestHandler } from '@minesweeper/infrastructure/server/requestHandler';
import { endpoints } from '@minesweeper/infrastructure/server/constants';

/*

Requerimientos:
  - debe contener el search param de bombs
  - debe contener el search param de rows
  - debe contener el search param de columns

  -los 3 parametros deben ser de tipo numero
  -los 3 parametros no deben ser un NaN

*/

describe('start game controller', () => {
  it('should throw error if not bombs is provided as parameter', () => {
    const server = createServer();

    // const response = await request(server).get(`${endpoints.game}?bombs=1&rows=2&columns=2`);

    // expect()
  });

  it('should return correct data', async () => {
    const server = createServer(requestHandler);

    const response = await request(server).get(`${endpoints.game}?bombs=1&rows=2&columns=2`);

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

    const response = await request(server).get(`${endpoints.game}?bombs=1&rows=0&columns=2`);

    expect(response.statusCode).toBe(400);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.message).toBeTruthy();
  });
});
