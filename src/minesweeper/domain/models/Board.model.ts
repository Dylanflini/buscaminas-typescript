import { BombModel } from './Bomb.model';
import { CellModel } from './Cell.model';
import { FlagModel } from './Flag.model';
import { NeighborsBombsCounter } from './NeighborsBombsCounter.model';

export interface IBoardId {
  boardId: string;
}

export interface BoardModel extends IBoardId {
  flags_available: number;
  bombs_available: number;
  rows: number;
  columns: number;
  cells: CellModel[];
  bombs: BombModel[];
  neighBorsBombsCounter: NeighborsBombsCounter[];
  flags: FlagModel[];
}
