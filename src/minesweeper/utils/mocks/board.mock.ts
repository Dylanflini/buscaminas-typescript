import { BoardModel, Cell } from '@minesweeper/domain/models';

export const cells2x2: Cell[] = [
  new Cell([0, 0]),
  new Cell([1, 0]),
  new Cell([0, 1]),
  new Cell([1, 1]),
];

export const boardId = '111-222-333';

export const flagAvailableMocked = 20;

export const boardMocked: BoardModel = {
  boardId,
  flags_available: flagAvailableMocked,
  bombs_available: 10,
  rows: 10,
  columns: 10,
  bombs: [{ position: [0, 0] }],
  cells: cells2x2,
  neighBorsBombsCounter: [{ position: [0, 0], quantity: 5 }],
  flags: [],
};
