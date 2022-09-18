import { IPosition } from '@minesweeper/lib/types';

export interface CellModel extends IPosition {
  exposed: boolean;
}
