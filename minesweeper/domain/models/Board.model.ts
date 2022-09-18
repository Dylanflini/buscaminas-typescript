import { IBoardId } from '@minesweeper/domain/commons.type';
import { BombModel } from './Bomb.model';
import { CellModel } from './Cell.model';
import { FlagModel } from './Flag.model';
import { NeighborsBombsCounter } from './NeighborsBombsCounter.model';

export interface PublicBoardModel {
  flags_available: number;
  cells: CellModel[];
  flags: FlagModel[];
}

export interface BoardModel extends IBoardId, PublicBoardModel {
  bombs_available: number;
  rows: number;
  columns: number;
  bombs: BombModel[];
  neighBorsBombsCounter: NeighborsBombsCounter[];
}
