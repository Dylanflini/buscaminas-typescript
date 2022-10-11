import request from 'supertest';
import { createServer } from 'http';

import { requestHandler } from '@minesweeper/infrastructure/server/requestHandler';
import { endpoints } from '@minesweeper/infrastructure/server/constants';

import { PublicBoardModel } from '@minesweeper/domain/models';

import { CellErrorMessages } from './exposeCell.controller';

describe('patch cell controller', () => {
  interface TestResponse extends request.Response {
    header: {
      'content-type': string;
    };
    body: PublicBoardModel;
  }

  interface TestErrorResponse extends request.Response {
    header: {
      'content-type': string;
    };
    body: { message: string };
  }

  describe('400 validations', () => {
    it('should response Bad Request Error if empty data is provided as body request', async () => {
      const server = createServer(requestHandler);

      const response: TestErrorResponse = await request(server).patch(endpoints.cells).send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(CellErrorMessages.BODY_EMPTY);
    });

    it('should response Bad Request Error if cell position property is not provided in the body request', async () => {
      const server = createServer(requestHandler);

      const response: TestErrorResponse = await request(server).patch(endpoints.cells).send({
        cell: '1-2',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(CellErrorMessages.BODY_WITHOUT_POSITION_PROPERTY);
    });

    it('should response Bad Request Error if cell position property in the body request is not an array', async () => {
      const server = createServer(requestHandler);

      const response: TestErrorResponse = await request(server).patch(endpoints.cells).send({
        position: '1-2',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(CellErrorMessages.BODY_POSITION_NOT_ARRAY);
    });

    const hasTwoElementsCases = [[[]], [[1]], [[1, 1, 1]]];

    it.each(hasTwoElementsCases)(
      'should response Bad Request Error if cell position property in the body request does not have two elements - (test nº %#)',
      async currentCase => {
        const server = createServer(requestHandler);

        const response: TestErrorResponse = await request(server).patch(endpoints.cells).send({
          position: currentCase,
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(CellErrorMessages.BODY_POSITION_NOT_TWO_ELEMENTS);
      },
    );

    const isNumberCases = [[['1', 2]], [[1, '2']], [['1', '1']]];

    it.each(isNumberCases)(
      'should response Bad Request Error if cell position elements are not number - (test nº %#)',
      async currentCase => {
        const server = createServer(requestHandler);

        const response: TestErrorResponse = await request(server).patch(endpoints.cells).send({
          position: currentCase,
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
          CellErrorMessages.BODY_POSITION_ELEMENTS_ARE_NOT_NUMBERS,
        );
      },
    );

    it('should response Bad Request Error if board id is not provided', async () => {
      const server = createServer(requestHandler);

      const response: TestErrorResponse = await request(server)
        .patch(endpoints.cells)
        .send({
          position: [2, 3],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(CellErrorMessages.NOT_BOARD_ID);
    });

    it('should response Bad Request Error if board id is not a string', async () => {
      const server = createServer(requestHandler);

      const response: TestErrorResponse = await request(server)
        .patch(endpoints.cells)
        .send({
          boardId: 111222333,
          position: [2, 3],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(CellErrorMessages.BOARD_ID_NOT_STRING);
    });
  });

  describe('200 validations', () => {
    it('should return response with status code 200 and content type json', async () => {
      const server = createServer(requestHandler);
      const startResponse: TestResponse = await request(server).get(
        `${endpoints.game}?bombs=2&rows=3&columns=3`,
      );
      expect(startResponse.statusCode).toBe(200);
      expect(startResponse.header['content-type']).toBe('application/json');

      const selectedCell = startResponse.body.cells[0]; // 0x0

      const patchCellResponse: TestResponse = await request(server).patch(endpoints.cells).send({
        boardId: '111222333',
        position: selectedCell.position,
      });

      expect(patchCellResponse.statusCode).toBe(200);
      expect(patchCellResponse.header['content-type']).toBe('application/json');
    });

    it('should return response with id', async () => {
      const server = createServer(requestHandler);
      const startResponse: TestResponse = await request(server).get(
        `${endpoints.game}?bombs=2&rows=4&columns=4`,
      );

      const { boardId, cells } = startResponse.body;

      expect(boardId).toBeTruthy();
      expect(typeof boardId).toBe('string');

      const selectedCell = cells[0]; // 0x0

      expect(selectedCell.isExposed).toBe(false);

      const patchCellResponse: TestResponse = await request(server).patch(endpoints.cells).send({
        boardId: '111222333',
        position: selectedCell.position,
      });

      const { cells: cellsUpdated } = patchCellResponse.body;

      const selectedCellUpdated = cellsUpdated[0];

      expect(selectedCellUpdated.isExposed).toBe(true);
      expect(selectedCellUpdated.position).toStrictEqual(selectedCell.position);

      expect(selectedCellUpdated.adjacentBombs).not.toBe(undefined);
      expect(selectedCellUpdated.hasBomb).not.toBe(undefined);

      expect(patchCellResponse.status).toBe(200);
    });
  });
});
