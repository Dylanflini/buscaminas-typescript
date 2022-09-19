import { IRepositoryUseCase } from '@minesweeper/domain/data.repository';
import { createBombs } from './createBombs';
import { createNeighborsCounter } from './createNeighborsCounter';
import { BoardModel, Cell, PublicBoardModel } from '@minesweeper/domain/models';
import { makeValidations } from './startGame.validations';

interface IStartGameProps extends IRepositoryUseCase {
  rows: number;
  columns: number;
  bombs: number;
}

type IStartGameUseCase = (props: IStartGameProps) => Promise<PublicBoardModel>;

/**
 * Start game base on initial props
 */
export const startGameUseCase: IStartGameUseCase = async ({
  bombs: bombsInput,
  rows,
  columns,
  dataRepository,
}) => {
  makeValidations(bombsInput, rows, columns);

  const cells: Cell[] = [];

  for (let y = 0; y < columns; y++) {
    for (let x = 0; x < rows; x++) {
      cells.push(new Cell([x, y]));
    }
  }

  const bombs = createBombs({ rows, columns, bombsInput });

  const boardWithoutId: Omit<BoardModel, 'boardId'> = {
    cells,
    bombs_available: bombsInput,
    bombs,
    rows,
    columns,
    flags_available: bombsInput,
    flags: [],
    neighBorsBombsCounter: createNeighborsCounter({ cells, bombs }),
  };

  const { boardId } = await dataRepository.createBoard(boardWithoutId);

  return {
    boardId,
    cells,
    flags: boardWithoutId.flags,
    flags_available: boardWithoutId.flags_available,
  };
};
