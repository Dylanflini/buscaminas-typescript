import { IPosition, TPosition } from '@minesweeper/domain/models';

type hasSamePosition = (
  firstElementPosition: TPosition,
  secondElementPosition: TPosition,
) => boolean;

export const hasSamePosition: hasSamePosition = (firstElementPosition, secondElementPosition) => {
  const [firstX, firstY] = firstElementPosition;
  const [secondX, secondY] = secondElementPosition;

  return firstX === secondX && firstY === secondY;
};

export const getPosition = (column: number, row: number): IPosition => ({
  position: [column, row],
});
