import { exposeCellUseCase } from '@minesweeper/use-cases/exposeCell/exposeCell';

import { dataRepository } from '@minesweeper/infrastructure/data';
import { RequestListener } from '@minesweeper/infrastructure/server/types';
import getBody from '@minesweeper/infrastructure/server/utils/getBody';

import {
  getPositionRequestBody,
  getPositionValidationErrors,
} from '../../lib/utils/positionValidations.util';

export const exposeCellController: RequestListener = async (request, response) => {
  const requestBody = await getBody(request);

  const { requestBodyValidated } = getPositionValidationErrors(requestBody);
  const { boardId, position } = getPositionRequestBody(requestBodyValidated);

  const board = await exposeCellUseCase({ boardId, position, dataRepository });

  response.statusCode = 200;
  response.write(
    JSON.stringify({
      ...board,
      cells: board.cells.map(cell => ({ ...cell, isExposed: cell.isExposed })),
    }),
  );
  response.end();
};
