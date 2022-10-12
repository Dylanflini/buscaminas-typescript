import { dataRepository } from '@minesweeper/infrastructure/data';
import { RequestListener } from '@minesweeper/infrastructure/server/types';
import getBody from '@minesweeper/infrastructure/server/utils/getBody';
import { ServerError } from '@minesweeper/infrastructure/server/utils/validations';
import { unMarkFlagUseCase } from '@minesweeper/use-cases/unmarkFlag/unMarkFlag';
import { getPositionValidationErrors } from '../../lib/utils/positionValidations.util';

export enum DeleteFlagErrorMessages {
  NO_FLAG_THERE = 'There is no flag in the position to delete it',
}

export const deleteFlagController: RequestListener = async (request, response) => {
  const requestBody = await getBody(request);

  const { requestBodyValidated } = getPositionValidationErrors(requestBody);

  try {
    const { boardId, position } = requestBodyValidated;
    const board = await unMarkFlagUseCase({
      boardId,
      position,
      dataRepository,
    });
    response.statusCode = 200;
    response.write(
      JSON.stringify({
        ...board,
        cells: board.cells.map(cell => ({ ...cell, isExposed: cell.isExposed })),
      }),
    );
    response.end();
  } catch (error) {
    /**
     * If we don't do this catch we don't receive the error.message, only 500 status
     * Is that ok?
     */
    if (error instanceof Error) throw new ServerError(500, error.message);
  }
};
