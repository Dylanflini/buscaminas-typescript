import { dataRepository } from '@minesweeper/infrastructure/data';
import { RequestListener } from 'http';
import { ServerError } from '@minesweeper/infrastructure/server/utils/validations';
import getBody from '@minesweeper/infrastructure/server/utils/getBody';
import { markFlagUseCase } from '@minesweeper/use-cases/markFlag/markFlag';
import { TPosition } from '@minesweeper/domain/models';

export enum flagsPostControllerErrors {
  EMPTY_BODY = 'must send position and boardId',
  BOARD_ID_IS_REQUIRED = 'board id is required',
  BOARD_ID_MUST_BE_STRING = 'board id must be a string',
  POSITION_IS_REQUIRED = 'position is required',
  POSITION_MUST_BE_ARRAY = 'position must be a array',
  POSITION_MUST_BE_ARRAY_OF_NUMBERS = 'position must be a array of two numbers',
}

const getFlagsParameters = (
  body: Record<string, unknown>,
): { boardId: string; position: TPosition } => {
  const boardEntry = Object.entries(body).find(([key]) => key === 'boardId');

  if (!boardEntry) throw new ServerError(400, flagsPostControllerErrors.BOARD_ID_IS_REQUIRED);

  const boardId = boardEntry[1];

  if (typeof boardId !== 'string')
    throw new ServerError(400, flagsPostControllerErrors.BOARD_ID_MUST_BE_STRING);

  const positionEntry = Object.entries(body).find(([key]) => key === 'position');

  if (!positionEntry) throw new ServerError(400, flagsPostControllerErrors.POSITION_IS_REQUIRED);

  const position = positionEntry[1];

  if (!Array.isArray(position))
    throw new ServerError(400, flagsPostControllerErrors.POSITION_MUST_BE_ARRAY);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [x, y] = position;

  if (typeof x !== 'number' || typeof y !== 'number')
    throw new ServerError(400, flagsPostControllerErrors.POSITION_MUST_BE_ARRAY_OF_NUMBERS);

  return { boardId, position: [x, y] };
};

export const flagsPostController: RequestListener = async (request, response) => {
  const body = await getBody(request);

  if (!body) throw new ServerError(400, flagsPostControllerErrors.EMPTY_BODY);

  const { boardId, position } = getFlagsParameters(body);

  const publicBoard = await markFlagUseCase({
    boardId,
    position,
    dataRepository,
  });

  response.write(
    JSON.stringify({
      ...publicBoard,
      cells: publicBoard.cells.map(cell => ({ ...cell, isExposed: cell.isExposed })),
    }),
  );
  response.end();
};
