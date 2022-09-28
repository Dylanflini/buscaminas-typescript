import { BombModel } from './Bomb.model';
import { Cell } from './Cell.model';
import { FlagModel } from './Flag.model';
import { NeighborsBombsCounter } from './NeighborsBombsCounter.model';

export interface IBoardId {
  boardId: string;
}

export interface GameModel {
  id: string;
  state?: 'WON' | 'LOST';
}

export interface BoardModel extends IBoardId {
  bombs_available: number;
  rows: number;
  columns: number;
  bombs: BombModel[];
  neighBorsBombsCounter: NeighborsBombsCounter[];
  flags_available: number;
  cells: Cell[];
  flags: FlagModel[];
}

export type PublicBoardModel = Pick<BoardModel, 'flags_available' | 'cells' | 'flags' | 'boardId'>;
