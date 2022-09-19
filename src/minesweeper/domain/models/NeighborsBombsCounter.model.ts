import { IPosition } from './Position.model';

export type TNeighborQuantity = number;

export interface NeighborsBombsCounter extends IPosition {
  quantity: TNeighborQuantity;
}
