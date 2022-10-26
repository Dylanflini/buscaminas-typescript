import request from 'supertest';
import { createServer } from 'http';

import { requestHandler } from '@minesweeper/infrastructure/server/requestHandler';
import { endpoints } from '@minesweeper/infrastructure/server/constants';

import { PositionErrorMessages } from '../../lib/constants/positionErrors.enum';
import { TestErrorResponse, TestResponse } from '../../lib/types/testController.type';
import { MarkFlagUCError } from '@minesweeper/use-cases/unmarkFlag/unMarkFlag.validations';

describe('delete flag controller', () => {
  describe('400 validations', () => {
    it('should response Bad Request Error if empty data is provided as body request', async () => {
      const server = createServer(requestHandler);
      const response: TestErrorResponse = await request(server).delete(endpoints.flags).send({});
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(PositionErrorMessages.BODY_EMPTY);
    });

    it('should response Bad Request Error if flag position property is not provided in the body request', async () => {
      const server = createServer(requestHandler);
      const response: TestErrorResponse = await request(server).delete(endpoints.flags).send({
        cell: '1-2',
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(PositionErrorMessages.BODY_WITHOUT_POSITION_PROPERTY);
    });

    it('should response Bad Request Error if flag position property in the body request is not an array', async () => {
      const server = createServer(requestHandler);
      const response: TestErrorResponse = await request(server).delete(endpoints.flags).send({
        position: '1-2',
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(PositionErrorMessages.BODY_POSITION_NOT_ARRAY);
    });

    const hasTwoElementsCases = [[[]], [[1]], [[1, 1, 1]]];

    it.each(hasTwoElementsCases)(
      'should response Bad Request Error if flag position property in the body request does not have two elements - (test nº %#)',
      async currentCase => {
        const server = createServer(requestHandler);
        const response: TestErrorResponse = await request(server).delete(endpoints.flags).send({
          position: currentCase,
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe(PositionErrorMessages.BODY_POSITION_NOT_TWO_ELEMENTS);
      },
    );

    const isNumberCases = [[['1', 2]], [[1, '2']], [['1', '1']]];

    it.each(isNumberCases)(
      'should response Bad Request Error if flag position elements are not number - (test nº %#)',
      async currentCase => {
        const server = createServer(requestHandler);
        const response: TestErrorResponse = await request(server).delete(endpoints.flags).send({
          position: currentCase,
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
          PositionErrorMessages.BODY_POSITION_ELEMENTS_ARE_NOT_NUMBERS,
        );
      },
    );

    /**
     * Board
     */

    it('should response Bad Request Error if board id is not provided', async () => {
      const server = createServer(requestHandler);
      const response: TestErrorResponse = await request(server)
        .delete(endpoints.flags)
        .send({
          position: [2, 3],
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(PositionErrorMessages.NOT_BOARD_ID);
    });

    it('should response Bad Request Error if board id is not a string', async () => {
      const server = createServer(requestHandler);
      const response: TestErrorResponse = await request(server)
        .delete(endpoints.flags)
        .send({
          boardId: 111222333,
          position: [2, 3],
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(PositionErrorMessages.BOARD_ID_NOT_STRING);
    });
  });

  describe('500 Server Error Business validations', () => {
    it('should response Server Error if there is no flags', async () => {
      const server = createServer(requestHandler);

      await request(server).get(`${endpoints.game}?bombs=2&rows=3&columns=3`);

      const response: TestErrorResponse = await request(server)
        .delete(endpoints.flags)
        .send({
          position: [2, 2],
          boardId: '111-222-333',
        });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe(MarkFlagUCError.NO_FLAGS);
    });

    it('should response Server Error if there is not a flag where flag position to delete was specified', async () => {
      const server = createServer(requestHandler);

      await request(server).get(`${endpoints.game}?bombs=2&rows=3&columns=3`);

      const response: TestErrorResponse = await request(server)
        .delete(endpoints.flags)
        .send({
          position: [2, 2],
          boardId: '111-222-333',
        });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe(MarkFlagUCError.NOT_EXISTS_A_FLAG);
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
      const deleteCellResponse: TestResponse = await request(server).delete(endpoints.flags).send({
        boardId: '111222333',
        position: selectedCell.position,
      });
      expect(deleteCellResponse.statusCode).toBe(200);
      expect(deleteCellResponse.header['content-type']).toBe('application/json');
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

      const deleteCellResponse: TestResponse = await request(server).delete(endpoints.flags).send({
        boardId: '111222333',
        position: selectedCell.position,
      });
      const { cells: cellsUpdated } = deleteCellResponse.body;

      expect(cellsUpdated).not.toContainEqual(selectedCell); // KEY EXPECT
      expect(deleteCellResponse.status).toBe(200);
    });
  });
});
