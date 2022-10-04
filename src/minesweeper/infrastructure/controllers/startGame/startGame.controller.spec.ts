import request from 'supertest';
import { createServer } from 'http';
import { requestHandler } from '@minesweeper/infrastructure/server/requestHandler';
import { endpoints } from '@minesweeper/infrastructure/server/constants';
import { GetQueryParamsErrorMessages } from '@minesweeper/infrastructure/server/utils/getQueryParams';
import { PublicBoardModel } from '@minesweeper/domain/models';

describe('start game controller', () => {
  interface TestResponse extends request.Response {
    body: PublicBoardModel;
  }

  interface TestErrorResponse extends request.Response {
    body: { message: string };
  }

  it('should response Bad Request Error if empty data is provided as query params', async () => {
    const server = createServer(requestHandler);

    const response: TestErrorResponse = await request(server).get(endpoints.game);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(GetQueryParamsErrorMessages.NOT_CONTAIN_QUERY_PARAMS);
  });

  it('should response Bad Request Error  if bombs are not provided as query params', async () => {
    const server = createServer(requestHandler);

    const response: TestErrorResponse = await request(server).get(
      `${endpoints.game}?columns=2&rows=2`,
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('bombs param is required');
  });

  it('should response Bad Request Error if bombs are not a number', async () => {
    const server = createServer(requestHandler);

    const response: TestErrorResponse = await request(server).get(
      `${endpoints.game}?bombs=hola&rows=3&columns=3`,
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('bombs must be a integer number');
  });

  it('should response Bad Request Error  if rows are not provided as query params', async () => {
    const server = createServer(requestHandler);

    const response: TestErrorResponse = await request(server).get(
      `${endpoints.game}?bombs=2&columns=3`,
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('rows param is required');
  });

  it('should response 400 error if rows are not a number', async () => {
    const server = createServer(requestHandler);

    const response: TestErrorResponse = await request(server).get(
      `${endpoints.game}?rows=hola&bombs=1&columns=3`,
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('rows must be a integer number');
  });

  it('should response 400 error if columns are not provided as query params', async () => {
    const server = createServer(requestHandler);

    const response: TestErrorResponse = await request(server).get(
      `${endpoints.game}?bombs=2&rows=4`,
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('columns param is required');
  });

  it('should response 400 error if columns are not a number', async () => {
    const server = createServer(requestHandler);

    const response: TestErrorResponse = await request(server).get(
      `${endpoints.game}?rows=3&bombs=1&columns=hola`,
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('columns must be a integer number');
  });

  it('should return response with status code 200 and content type json', async () => {
    const server = createServer(requestHandler);

    const response = await request(server).get(`${endpoints.game}?bombs=1&rows=2&columns=2`);

    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.header['content-type']).toBe('application/json');
  });

  it('should return response with id', async () => {
    const server = createServer(requestHandler);

    const response: TestResponse = await request(server).get(
      `${endpoints.game}?bombs=1&rows=2&columns=2`,
    );

    const { boardId } = response.body;

    expect(boardId).toBeTruthy();
    expect(typeof boardId).toBe('string');
  });

  it('should return response with cells', async () => {
    const server = createServer(requestHandler);

    const response: TestResponse = await request(server).get(
      `${endpoints.game}?bombs=1&rows=2&columns=2`,
    );

    expect(response.body.cells).toStrictEqual([
      { position: [0, 0], isExposed: false },
      { position: [1, 0], isExposed: false },
      { position: [0, 1], isExposed: false },
      { position: [1, 1], isExposed: false },
    ]);
  });
});
