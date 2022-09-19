import { BombModel, Cell, NeighborsBombsCounter } from '@minesweeper/domain/models';

const filterBombsAround =
  (cell: Cell) =>
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
  cells: Cell[];
  bombs: BombModel[];
}

type TCreateNeighborsCounter = (props: ICreateNeighborsCounter) => NeighborsBombsCounter[];

export const createNeighborsCounter: TCreateNeighborsCounter = ({ cells, bombs }) =>
  cells.map(cell => {
    const foundBombsAround = bombs.filter(filterBombsAround(cell));

    return { position: cell.position, quantity: foundBombsAround.length };
  });
