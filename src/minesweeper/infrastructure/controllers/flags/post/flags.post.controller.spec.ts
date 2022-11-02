import request from 'supertest';
import { createServer } from 'http';
import { requestHandler } from '@minesweeper/infrastructure/server/requestHandler';
import { endpoints } from '@minesweeper/infrastructure/server/constants';
import { PublicBoardModel } from '@minesweeper/domain/models';
import { flagsPostControllerErrors } from './flags.post.controller';

describe('Flags post controller - Bad Request Errors', () => {
  interface TestErrorResponse extends request.Response {
    body: { message: string };
  }

  it('should response Bad Request Error if empty data is provided in body request', async () => {
    const server = createServer(requestHandler);

    const response: TestErrorResponse = await request(server).post(endpoints.flags);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(flagsPostControllerErrors.EMPTY_BODY);
  });

  it('should response Bad Request Error if boardId is not provided in body request', async () => {
    const server = createServer(requestHandler);

    const response: TestErrorResponse = await request(server)
      .post(endpoints.flags)
      .send({ position: [0, 0] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(flagsPostControllerErrors.BOARD_ID_IS_REQUIRED);
  });

  it('should response Bad Request Error if boardId is not a string', async () => {
    const server = createServer(requestHandler);

    const response: TestErrorResponse = await request(server)
      .post(endpoints.flags)
      .send({ position: [0, 0], boardId: 12 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(flagsPostControllerErrors.BOARD_ID_MUST_BE_STRING);
  });

  it('should response Bad Request Error if position is not provided in body request', async () => {
    const server = createServer(requestHandler);

    const response: TestErrorResponse = await request(server)
      .post(endpoints.flags)
      .send({ boardId: '12123' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(flagsPostControllerErrors.POSITION_IS_REQUIRED);
  });

  it('should response Bad Request Error if position is not a array', async () => {
    const server = createServer(requestHandler);

    const response: TestErrorResponse = await request(server)
      .post(endpoints.flags)
      .send({ position: 'string', boardId: '12qwe234' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(flagsPostControllerErrors.POSITION_MUST_BE_ARRAY);
  });

  it.each([
    [undefined, undefined],
    [0, undefined],
    [undefined, 0],
    ['as', 0],
    [0, 'asd'],
  ])(
    'should response Bad Request Error if position is not a array with two numbers - test n %#',
    async (x, y) => {
      const server = createServer(requestHandler);

      const response: TestErrorResponse = await request(server)
        .post(endpoints.flags)
        .send({ position: [x, y], boardId: '12qwe234' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        flagsPostControllerErrors.POSITION_MUST_BE_ARRAY_OF_NUMBERS,
      );
    },
  );
});

describe('flags post controller - 200 responses', () => {
  interface TestResponse extends request.Response {
    body: PublicBoardModel;
  }

  it('should return 200 status code', async () => {
    const server = createServer(requestHandler);

    await request(server).get(`${endpoints.game}?bombs=2&rows=4&columns=4`);

    const response: TestResponse = await request(server)
      .post(endpoints.flags)
      .send({ position: [0, 0], boardId: '12qwe234' });

    expect(response.status).toBe(200);
  });

  it('should return public board', async () => {
    const server = createServer(requestHandler);

    const startResponse: TestResponse = await request(server).get(
      `${endpoints.game}?bombs=2&rows=3&columns=4`,
    );

    expect(startResponse.body.flags.length).toBe(0);

    const cellMarked = [0, 0];

    const response: TestResponse = await request(server)
      .post(endpoints.flags)
      .send({ position: cellMarked, boardId: '12qwe234' });

    const { flags, cells } = response.body;

    expect(flags).toBeTruthy();
    expect(flags.length).toBe(1);
    expect(flags[0].position).toStrictEqual(cellMarked);

    expect(cells).toBeTruthy();
    expect(cells.length).toBe(12);
    expect(cells.every(c => c.isExposed === false)).toBe(true);
  });
});
