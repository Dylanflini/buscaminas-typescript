import { IPosition } from '@minesweeper/domain/commons.type';

export interface CellModel extends IPosition {
  exposed: boolean;
}
