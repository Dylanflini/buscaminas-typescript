import { Cell } from '@minesweeper/domain/models';

interface ICreateCells {
  rows: number;
  columns: number;
}

type TCreateCells = (props: ICreateCells) => Cell[];

export const createCells: TCreateCells = ({ rows, columns }) => {
  const cells: Cell[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      cells.push(new Cell([x, y]));
    }
  }
  return cells;
};
