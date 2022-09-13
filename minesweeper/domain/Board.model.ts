import { BombModel } from "./Bomb.model";
import { CellModel } from "./Cell.model";
import { FlagModel } from "./Flag.model";
import { NeighborsBombsCounter } from "./NeighborsBombsCounter.model";

export interface BoardModel {
  id: string;
  flag_available: number;
  bombs_available: number;
  rows: number;
  columns: number;
  cells: CellModel[];
  bombs: BombModel[];
  neighBorsBombsCounter: NeighborsBombsCounter[];
  flags: FlagModel[];
}
