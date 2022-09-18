import { IPosition } from '@minesweeper/domain/commons.type';

export interface CellModel extends IPosition {
  /**
   * represent internal state of cell
   *
   * if is "undefined" it means that the cell is not exposed and the user doesn't know if this cell is a bomb or not
   */
  isBomb?: boolean;
  /**
   * if is "undefined" it means the cell does not be exposed
   *
   * adjacent bombs only have a value from 0 to 8
   */
  adjacentBombs?: number;
}
