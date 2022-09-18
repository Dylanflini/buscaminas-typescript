import { IPosition } from '@minesweeper/domain/commons.type';

export type TNeighborQuantity = number;

export interface NeighborsBombsCounter extends IPosition {
  quantity: TNeighborQuantity;
}
