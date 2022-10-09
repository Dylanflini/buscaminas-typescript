import { exposeCellUseCase } from '@minesweeper/use-cases/exposeCell/exposeCell';

import { dataRepository } from '@minesweeper/infrastructure/data';
import { RequestListener } from '@minesweeper/infrastructure/server/types';
import getBody from '@minesweeper/infrastructure/server/utils/getBody';
import { ServerError } from '@minesweeper/infrastructure/server/utils/validations';

/**
 * Types
 */

type TPosition = [number, number];

interface BodyRequest {
  boardId: string;
  position: TPosition;
}

const validations = (requestBody: Partial<BodyRequest>) => {
  const requestKeys = Object.keys(requestBody);

  const bodyIsEmpty = requestKeys.length === 0 || !requestBody;
  const bodyHasPositionProperty = requestKeys.some(key => key === 'position');
  const bodyPositionIsArray = Array.isArray(requestBody?.position);

  const bodyHasBoardIdProperty = requestKeys.some(key => key === 'boardId');

  return {
    BODY_IS_EMPTY: bodyIsEmpty,

    BODY_HAS_POSITION_PROPERTY: !bodyIsEmpty && bodyHasPositionProperty,
    BODY_POSITION_IS_ARRAY: bodyHasPositionProperty && bodyPositionIsArray,
    BODY_POSITION_HAS_TWO_ELEMENTS:
      bodyPositionIsArray && (requestBody.position as [number, number]).length === 2,
    BODY_POSITION_ELEMENTS_ARE_NUMBERS:
      bodyPositionIsArray &&
      (requestBody.position as [number, number]).every(item => typeof item === 'number'),

    BODY_HAS_BOARD_ID_PROPERTY: !bodyIsEmpty && bodyHasBoardIdProperty,
    BOARD_ID_IS_STRING: bodyHasBoardIdProperty && typeof requestBody.boardId === 'string',

    requestBodyValidated: requestBody as BodyRequest,
  };
};

export enum CellErrorMessages {
  BODY_EMPTY = 'Must send data in the body',

  BODY_WITHOUT_POSITION_PROPERTY = 'Must send position property in the body',
  BODY_POSITION_NOT_ARRAY = 'Must send position property as an array',
  BODY_POSITION_NOT_TWO_ELEMENTS = 'Must send two elements in position property',
  BODY_POSITION_ELEMENTS_ARE_NOT_NUMBERS = 'Must send position property elements as numbers',

  NOT_BOARD_ID = 'Must provide id of board to play',
  BOARD_ID_NOT_STRING = 'Must provide a board id as string',
}

export const exposeCellController: RequestListener = async (request, response) => {
  const requestBody = await getBody(request);

  const {
    BODY_IS_EMPTY,
    BODY_HAS_POSITION_PROPERTY,
    BODY_POSITION_IS_ARRAY,
    BODY_POSITION_HAS_TWO_ELEMENTS,
    BODY_POSITION_ELEMENTS_ARE_NUMBERS,
    BODY_HAS_BOARD_ID_PROPERTY,
    BOARD_ID_IS_STRING,
    requestBodyValidated,
  } = validations(requestBody);

  /**
   * Body Validations
   */
  if (BODY_IS_EMPTY) throw new ServerError(400, CellErrorMessages.BODY_EMPTY);

  /**
   * Position Validations
   */
  if (!BODY_HAS_POSITION_PROPERTY)
    throw new ServerError(400, CellErrorMessages.BODY_WITHOUT_POSITION_PROPERTY);

  if (!BODY_POSITION_IS_ARRAY)
    throw new ServerError(400, CellErrorMessages.BODY_POSITION_NOT_ARRAY);

  if (!BODY_POSITION_HAS_TWO_ELEMENTS)
    throw new ServerError(400, CellErrorMessages.BODY_POSITION_NOT_TWO_ELEMENTS);

  if (!BODY_POSITION_ELEMENTS_ARE_NUMBERS)
    throw new ServerError(400, CellErrorMessages.BODY_POSITION_ELEMENTS_ARE_NOT_NUMBERS);

  /**
   * Board validations
   */
  if (!BODY_HAS_BOARD_ID_PROPERTY) throw new ServerError(400, CellErrorMessages.NOT_BOARD_ID);
  if (!BOARD_ID_IS_STRING) throw new ServerError(400, CellErrorMessages.BOARD_ID_NOT_STRING);

  const position = Object.entries(requestBodyValidated).find(
    entry => entry[0] === 'position',
  )?.[1] as TPosition;
  const boardId = Object.entries(requestBodyValidated).find(
    entry => entry[0] === 'boardId',
  )?.[1] as string;

  // This try catch can be a decorator
  try {
    const board = await exposeCellUseCase({ boardId, position, dataRepository });

    response.statusCode = 200;
    response.write(
      JSON.stringify({
        ...board,
        cells: board.cells.map(cell => ({ ...cell, isExposed: cell.isExposed })),
      }),
    );
    response.end();
  } catch (error) {
    // What to do if not ?
    throw error
  }
};
