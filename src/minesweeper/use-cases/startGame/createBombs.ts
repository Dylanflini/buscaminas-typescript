import { BombModel } from '@minesweeper/domain/models';
import { getRandomNumber, getSamePosition } from '@minesweeper/utils';

interface ICreateBombs {
  rows: number;
  columns: number;
  bombsInput: number;
}

type TCreateBombs = (props: ICreateBombs) => BombModel[];

export const createBombs: TCreateBombs = ({ bombsInput, rows, columns }) => {
  const bombs: BombModel[] = [];

  while (bombs.length < bombsInput) {
    const newBomb: BombModel = {
      position: [getRandomNumber(rows - 1), getRandomNumber(columns - 1)],
    };

    const samePosition = getSamePosition(newBomb.position[0], newBomb.position[1]);

    const haveSamePosition = bombs.some(bomb => samePosition(bomb));

    if (!haveSamePosition) bombs.push(newBomb);
  }
  return bombs;
};
