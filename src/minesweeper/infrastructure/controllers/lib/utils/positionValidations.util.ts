/**
 * Types
 */

import { TPosition } from '@minesweeper/domain/models/Position.model';
import { ServerError } from '@minesweeper/infrastructure/server/utils/validations';
import { PositionErrorMessages } from '../constants/positionErrors.enum';
import { PositionBodyRequest } from '../types/controller.type';

export const runPositionValidations = (requestBody: Partial<PositionBodyRequest> | null) => {
  const requestKeys = Object.keys(requestBody || {});

  const bodyIsEmpty = requestKeys.length === 0 || !requestBody;
  const bodyHasPositionProperty = requestKeys.some(key => key === 'position');
  const bodyPositionIsArray = Array.isArray(requestBody?.position);

  const bodyHasBoardIdProperty = requestKeys.some(key => key === 'boardId');

  return {
    BODY_IS_EMPTY: bodyIsEmpty,

    BODY_HAS_POSITION_PROPERTY: !bodyIsEmpty && bodyHasPositionProperty,
    BODY_POSITION_IS_ARRAY: bodyHasPositionProperty && bodyPositionIsArray,
    BODY_POSITION_HAS_TWO_ELEMENTS:
      bodyPositionIsArray && (requestBody?.position as [number, number]).length === 2,
    BODY_POSITION_ELEMENTS_ARE_NUMBERS:
      bodyPositionIsArray &&
      (requestBody?.position as [number, number]).every(item => typeof item === 'number'),

    BODY_HAS_BOARD_ID_PROPERTY: !bodyIsEmpty && bodyHasBoardIdProperty,
    BOARD_ID_IS_STRING: bodyHasBoardIdProperty && typeof requestBody?.boardId === 'string',

    requestBodyValidated: requestBody as PositionBodyRequest,
  };
};

export const getPositionValidationErrors = (requestBody: Partial<PositionBodyRequest> | null) => {
  const {
    BODY_IS_EMPTY,
    BODY_HAS_POSITION_PROPERTY,
    BODY_POSITION_IS_ARRAY,
    BODY_POSITION_HAS_TWO_ELEMENTS,
    BODY_POSITION_ELEMENTS_ARE_NUMBERS,
    BODY_HAS_BOARD_ID_PROPERTY,
    BOARD_ID_IS_STRING,
    requestBodyValidated,
  } = runPositionValidations(requestBody);

  /**
   * Body Validations
   */
  if (BODY_IS_EMPTY) throw new ServerError(400, PositionErrorMessages.BODY_EMPTY);

  /**
   * Position Validations
   */
  if (!BODY_HAS_POSITION_PROPERTY)
    throw new ServerError(400, PositionErrorMessages.BODY_WITHOUT_POSITION_PROPERTY);

  if (!BODY_POSITION_IS_ARRAY)
    throw new ServerError(400, PositionErrorMessages.BODY_POSITION_NOT_ARRAY);

  if (!BODY_POSITION_HAS_TWO_ELEMENTS)
    throw new ServerError(400, PositionErrorMessages.BODY_POSITION_NOT_TWO_ELEMENTS);

  if (!BODY_POSITION_ELEMENTS_ARE_NUMBERS)
    throw new ServerError(400, PositionErrorMessages.BODY_POSITION_ELEMENTS_ARE_NOT_NUMBERS);

  /**
   * Board validations
   */
  if (!BODY_HAS_BOARD_ID_PROPERTY) throw new ServerError(400, PositionErrorMessages.NOT_BOARD_ID);
  if (!BOARD_ID_IS_STRING) throw new ServerError(400, PositionErrorMessages.BOARD_ID_NOT_STRING);

  return {
    requestBodyValidated,
  };
};

export const getPositionRequestBody = (requestBody: PositionBodyRequest) => {
  const position = Object.entries(requestBody).find(
    entry => entry[0] === 'position',
  )?.[1] as TPosition;
  const boardId = Object.entries(requestBody).find(entry => entry[0] === 'boardId')?.[1] as string;

  return { position, boardId };
};
