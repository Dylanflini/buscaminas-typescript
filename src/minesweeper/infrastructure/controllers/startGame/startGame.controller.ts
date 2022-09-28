import { dataRepository } from '@minesweeper/infrastructure/data';
import { RequestListener } from '@minesweeper/infrastructure/server/types';
import { getQueryParams } from '@minesweeper/infrastructure/server/utils/getQueryParams';
import { ServerError } from '@minesweeper/infrastructure/server/utils/validations';
import { startGameUseCase } from '@minesweeper/use-cases/startGame/startGame';
import { MinesweeperError } from '@minesweeper/use-cases/validations';

export const startGameController: RequestListener = async (req, res) => {
  const searchParams = getQueryParams(req);

  const rows = Number(searchParams.get('rows'));
  const columns = Number(searchParams.get('columns'));
  const bombs = Number(searchParams.get('bombs'));

  try {
    const { cells, boardId } = await startGameUseCase({
      bombs,
      columns,
      rows,
      dataRepository,
    });

    res.statusCode = 200;
    res.write(
      JSON.stringify({
        id: boardId,
        cells: cells.map(cell => ({ ...cell, isExposed: cell.isExposed })),
      }),
    );
    res.end();
  } catch (error) {
    console.log(error);
    if (error instanceof MinesweeperError) {
      throw new ServerError(400, error.message);
    }
    throw new ServerError(500, 'Internal Server Error');
  }
};
