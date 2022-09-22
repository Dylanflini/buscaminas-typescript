import { BoardModel, Cell } from '@minesweeper/domain/models';
import { getAdjacentVertex, hasSamePosition, hasSomeWithSamePosition } from '@minesweeper/utils';

const cellWithoutCheck = (item: Cell) => item.adjacentBombs === 0 && item.hasBomb === undefined;

const findMatchedCounter = (board: BoardModel, toCompare: Cell) =>
  board.neighBorsBombsCounter.find(counter => hasSamePosition(counter, toCompare));

const addAdjacentBombsToAdjacentCells = (board: BoardModel, item: Cell) => {
  const adjacentCells = getAdjacentVertex(board.cells, item);

  adjacentCells.map(adjacentCell => {
    const matchedCounter = findMatchedCounter(board, adjacentCell);

    adjacentCell.adjacentBombs = matchedCounter
      ? matchedCounter.quantity
      : adjacentCell.adjacentBombs;

    return adjacentCell;
  });
};

export const repeatablyExposeEmptyCells = (board: BoardModel) => {
  while (board.cells.some(cellWithoutCheck)) {
    board.cells.filter(cellWithoutCheck).map(item => {
      if (!hasSomeWithSamePosition(board.bombs, item)) item.hasBomb = false;

      addAdjacentBombsToAdjacentCells(board, item);

      return item;
    });
  }
};

export const updateStateOfAdjacentCells = (board: BoardModel, cell: Cell) => {
  addAdjacentBombsToAdjacentCells(board, cell);
};
