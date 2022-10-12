import { IPosition } from '@minesweeper/domain/models';

export interface PositionBodyRequest extends IPosition {
  boardId: string;
}
