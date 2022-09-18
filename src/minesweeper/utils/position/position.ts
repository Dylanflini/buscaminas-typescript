import { IPosition } from '@minesweeper/lib/types';
import { FlagModel } from '@minesweeper/domain/models';

export const getSamePosition = (columnMarked: number, rowMarked: number) => {
  const samePosition = ({ position: [column, row] }: IPosition) =>
    column === columnMarked && row === rowMarked;

  return samePosition;
};

export const getPosition = (column: number, row: number): FlagModel => ({
  position: [column, row],
});
