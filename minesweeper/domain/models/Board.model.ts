import { IBoardId } from '@minesweeper/domain/commons.type';
import { BombModel } from './Bomb.model';
import { CellModel } from './Cell.model';
import { FlagModel } from './Flag.model';
import { NeighborsBombsCounter } from './NeighborsBombsCounter.model';

export interface BoardModel extends IBoardId {
  bombs_available: number;
  rows: number;
  columns: number;
  bombs: BombModel[];
  neighBorsBombsCounter: NeighborsBombsCounter[];
  flags_available: number;
  cells: CellModel[];
  flags: FlagModel[];
}

export type PublicBoardModel = Pick<BoardModel, 'flags_available' | 'cells' | 'flags'>;
