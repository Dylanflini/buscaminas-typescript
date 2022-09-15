import { IPosition } from './commons.type';

export type TNeighborQuantity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface NeighborsBombsCounter extends IPosition {
  quantity: TNeighborQuantity;
}
