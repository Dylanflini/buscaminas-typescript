import { IPosition, TPosition } from '@minesweeper/domain/models';

type hasSamePosition = (
  fistElementPosition: TPosition,
  secondElementPosition: TPosition,
) => boolean;

export const hasSamePosition: hasSamePosition = (fistElementPosition, secondElementPosition) => {
  const [fistX, firstY] = fistElementPosition;
  const [secondX, secondY] = secondElementPosition;

  return fistX === secondX && firstY === secondY;
};

export const getPosition = (column: number, row: number): IPosition => ({
  position: [column, row],
});
