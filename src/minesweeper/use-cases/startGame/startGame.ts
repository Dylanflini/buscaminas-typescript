import { IRepositoryUseCase } from '@minesweeper/domain/data.repository';
import { createBombs } from './createBombs';
import { createNeighborsCounter } from './createNeighborsCounter';
import { BoardModel, Cell, PublicBoardModel } from '@minesweeper/domain/models';

export enum ErrorStartGame {
  BOMBS_GREATER_THAN_ZERO = 'bombs must be greater than 0',
  ROWS_GREATER_THAN_ZERO = 'rows must be greater than 0',
  COLUMNS_GREATER_THAN_ZERO = 'columns must be greater than 0',
  ROWS_AND_COLUMNS_GREATER_THAN_ONE = 'rows and columns must be greater than 1',
  BOMBS_GREATER_THAN_TOTAL_CELLS = 'bombs must be less than total cells',
  DB_ERROR = 'error try saving board data',
}

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
  if (bombsInput < 1) throw Error(ErrorStartGame.BOMBS_GREATER_THAN_ZERO);
  if (rows < 1) throw Error(ErrorStartGame.ROWS_GREATER_THAN_ZERO);
  if (columns < 1) throw Error(ErrorStartGame.COLUMNS_GREATER_THAN_ZERO);
  if (rows < 2 && columns < 2) throw new Error(ErrorStartGame.ROWS_AND_COLUMNS_GREATER_THAN_ONE);

  const totalCells = columns * rows;

  if (bombsInput >= totalCells) throw Error(ErrorStartGame.BOMBS_GREATER_THAN_TOTAL_CELLS);

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

  try {
    const { boardId } = await dataRepository.createBoard(boardWithoutId);

    const { bombs, neighBorsBombsCounter, ...rest } = boardWithoutId;

    return {
      ...rest,
      boardId,
    };
  } catch (error) {
    console.error(error);
    throw Error(ErrorStartGame.DB_ERROR);
  }
};
