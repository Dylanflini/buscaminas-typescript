import { IPosition } from './commons.type';

export type TNeighborQuantity = number;

export interface NeighborsBombsCounter extends IPosition {
  quantity: TNeighborQuantity;
}
