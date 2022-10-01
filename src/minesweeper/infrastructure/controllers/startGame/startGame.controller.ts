import { dataRepository } from '@minesweeper/infrastructure/data';
import { RequestListener } from 'http';
import {
  getQueryParams,
  GetQueryParamsError,
} from '@minesweeper/infrastructure/server/utils/getQueryParams';
import { ServerError } from '@minesweeper/infrastructure/server/utils/validations';
import { startGameUseCase } from '@minesweeper/use-cases/startGame/startGame';
import { MinesweeperError } from '@minesweeper/use-cases/validations';

export const startGameController: RequestListener = async (request, response) => {
  try {
    const searchParams = getQueryParams(request.url);
    const bombsParam = searchParams.get('bombs');
    const rowsParam = searchParams.get('rows');
    const columnsParam = searchParams.get('columns');

    if (!bombsParam) throw new ServerError(400, 'bombs param is required');

    if (!rowsParam) throw new ServerError(400, 'rows param is required');

    if (!columnsParam) throw new ServerError(400, 'columns param is required');

    const bombs = Number(bombsParam);
    const rows = Number(rowsParam);
    const columns = Number(columnsParam);

    const { cells, boardId } = await startGameUseCase({
      bombs,
      columns,
      rows,
      dataRepository,
    });

    response.statusCode = 200;

    response.write(
      JSON.stringify({
        id: boardId,
        cells: cells.map(cell => ({ ...cell, isExposed: cell.isExposed })),
      }),
    );

    response.end();
  } catch (error) {
    if (error instanceof GetQueryParamsError || error instanceof MinesweeperError) {
      throw new ServerError(400, error.message);
    }

    throw error;
  }
};
