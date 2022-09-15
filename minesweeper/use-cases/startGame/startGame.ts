import { BoardModel } from "@minesweeper/domain/Board.model";
import { BombModel } from "@minesweeper/domain/Bomb.model";
import { CellModel } from "@minesweeper/domain/Cell.model";
import { IDataRepository } from "@minesweeper/domain/data.repository";
import { NeighborsBombsCounter } from "@minesweeper/domain/NeighborsBombsCounter.model";

export enum ErrorStartGame {
  BOMBS_GREATER_THAN_ZERO = "bombs must be greater than 0",
  ROWS_GREATER_THAN_ZERO = "rows must be greater than 0",
  COLUMNS_GREATER_THAN_ZERO = "columns must be greater than 0",
  ROWS_AND_COLUMNS_GREATER_THAN_ONE = "rows and columns must be greater than 1",
  BOMBS_GREATER_THAN_TOTAL_CELLS = "bombs must be less than total cells",
}

interface IStartGameProps {
  data: IDataRepository;
  rows: number;
  columns: number;
  bombs: number;
}

type IBoardResponse = BoardModel;

type IStartGameUseCase = (props: IStartGameProps) => Promise<IBoardResponse>;

/**
 * start game base on initial props
 */

export const startGameUseCase: IStartGameUseCase = async ({
  bombs: bombsInput,
  rows,
  columns,
  data,
}) => {
  if (bombsInput < 1) {
    throw Error(ErrorStartGame.BOMBS_GREATER_THAN_ZERO);
  }

  if (rows < 1) {
    throw Error(ErrorStartGame.ROWS_GREATER_THAN_ZERO);
  }

  if (columns < 1) {
    throw Error(ErrorStartGame.COLUMNS_GREATER_THAN_ZERO);
  }

  if (rows < 2 && columns < 2) {
    throw new Error(ErrorStartGame.ROWS_AND_COLUMNS_GREATER_THAN_ONE);
  }

  const totalCells = columns * rows;

  if (bombsInput >= totalCells) {
    throw Error(ErrorStartGame.BOMBS_GREATER_THAN_TOTAL_CELLS);
  }

  const cells: CellModel[] = [];

  for (let y = 0; y < columns; y++) {
    for (let x = 0; x < rows; x++) {
      cells.push({ exposed: false, position: [x, y] });
    }
  }

  const getRandomNumber = (max: number): number =>
    Math.round(Math.random() * max);

  const bombs: BombModel[] = [];

  while (bombs.length < bombsInput) {
    const newBomb: BombModel = {
      position: [getRandomNumber(rows - 1), getRandomNumber(columns - 1)],
    };

    const haveSamePosition = bombs.some(
      (bomb) =>
        bomb.position[0] === newBomb.position[0] &&
        bomb.position[1] === newBomb.position[1]
    );

    if (!haveSamePosition) {
      bombs.push(newBomb);
    }
  }

  const neighBorsBombsCounter: NeighborsBombsCounter[] = [];

  const boardWithoutId: Omit<BoardModel, "id"> = {
    cells,
    bombs_available: bombsInput,
    bombs,
    rows,
    columns,
    flag_available: bombsInput,
    flags: [],
    neighBorsBombsCounter,
  };

  const { id } = await data.saveBoard(boardWithoutId);

  return {
    id,
    ...boardWithoutId,
  };
};
