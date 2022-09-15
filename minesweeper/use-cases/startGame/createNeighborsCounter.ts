import { BombModel } from '@minesweeper/domain/Bomb.model';
import { CellModel } from '@minesweeper/domain/Cell.model';
import { NeighborsBombsCounter } from '@minesweeper/domain/NeighborsBombsCounter.model';

const filterBombsAround =
  (cell: CellModel) =>
  (bomb: BombModel): boolean => {
    const [cellX, CellY] = cell.position;
    const [bombX, bombY] = bomb.position;
    return (
      bombX >= cellX - 1 &&
      bombX <= cellX + 1 &&
      bombY >= CellY - 1 &&
      bombY <= CellY + 1 &&
      (bombX !== cellX || bombY !== CellY)
    );
  };

interface ICreateNeighborsCounter {
  cells: CellModel[];
  bombs: BombModel[];
}

type TCreateNeighborsCounter = (props: ICreateNeighborsCounter) => NeighborsBombsCounter[];

export const createNeighborsCounter: TCreateNeighborsCounter = ({ cells, bombs }) =>
  cells.map(cell => {
    const foundBombsAround = bombs.filter(filterBombsAround(cell));

    return { position: cell.position, quantity: foundBombsAround.length };
  });
