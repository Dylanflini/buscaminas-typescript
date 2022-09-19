import { IPosition, TPosition } from './Position.model';

export class Cell implements IPosition {
  /**
   * represent internal state of cell
   *
   * if is "undefined" it means that the cell is not exposed and the user doesn't know if this cell is a bomb or not
   */
  public hasBomb?: boolean | undefined;
  /**
   * if is "undefined" it means the cell does not be exposed
   *
   * adjacent bombs only have a value from 0 to 8
   */
  public adjacentBombs?: number | undefined;

  constructor(public position: TPosition, config: Partial<Cell> = {}) {
    Object.assign(this, config);
  }

  public get isExposed(): boolean {
    return this.adjacentBombs !== undefined || this.hasBomb !== undefined;
  }
}
