import { IBoardId } from '@minesweeper/lib/types';
import { BombModel } from './Bomb.model';
import { CellModel } from './Cell.model';
import { FlagModel } from './Flag.model';
import { NeighborsBombsCounter } from './NeighborsBombsCounter.model';

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

export interface PublicBoardModel
  extends Omit<
    BoardModel,
    'neighBorsBombsCounter' | 'bombs' | 'bombs_available' | 'columns' | 'rows'
  > {
  user: string;
}
