import { dataRepository } from '@minesweeper/infrastructure/data';
import { RequestListener } from 'http';
import {
  getSearchParams,
  GetQueryParamsError,
} from '@minesweeper/infrastructure/server/utils/getQueryParams';
import { ServerError } from '@minesweeper/infrastructure/server/utils/validations';
import { startGameUseCase } from '@minesweeper/use-cases/startGame/startGame';
import { MinesweeperError } from '@minesweeper/use-cases/validations';

export const startGameController: RequestListener = async (request, response) => {
  try {
    const searchParams = getSearchParams(request.url);

    const requiredGameParams = ['bombs', 'rows', 'columns'];

    const [bombs, rows, columns] = requiredGameParams.map(param => {
      const searchParam = searchParams.get(param);

      if (!searchParam) throw new ServerError(400, `${param} param is required`);

      return Number(searchParam);
    });

    const board = await startGameUseCase({
      bombs,
      columns,
      rows,
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
    if (error instanceof GetQueryParamsError || error instanceof MinesweeperError) {
      throw new ServerError(400, error.message);
    }

    throw error;
  }
};
