import { IPosition } from '@minesweeper/domain/models';

type hasSamePosition = (firstElement: IPosition, secondElement: IPosition) => boolean;

export const hasSamePosition: hasSamePosition = (firstElement, secondElement) => {
  const [firstX, firstY] = firstElement.position;
  const [secondX, secondY] = secondElement.position;

  return firstX === secondX && firstY === secondY;
};

export const getPosition = (column: number, row: number): IPosition => ({
  position: [column, row],
});
