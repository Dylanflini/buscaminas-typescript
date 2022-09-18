import { IPosition } from '@minesweeper/lib/types';

export type TNeighborQuantity = number;

export interface NeighborsBombsCounter extends IPosition {
  quantity: TNeighborQuantity;
}
