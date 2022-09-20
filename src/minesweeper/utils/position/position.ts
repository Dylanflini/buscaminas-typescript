import { IPosition } from '@minesweeper/domain/models';

type hasSamePosition = (firstElement: IPosition, secondElement: IPosition) => boolean;

type HasSomeWithSamePosition = (items: IPosition[], toCompare: IPosition) => boolean;

export const hasSamePosition: hasSamePosition = (firstElement, secondElement) => {
  const [firstX, firstY] = firstElement.position;
  const [secondX, secondY] = secondElement.position;

  return firstX === secondX && firstY === secondY;
};

export const getPosition = (column: number, row: number): IPosition => ({
  position: [column, row],
});

export const hasSomeWithSamePosition: HasSomeWithSamePosition = (items, toCompare) => {
  return items.some(item => hasSamePosition(item, toCompare));
};
