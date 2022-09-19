import { BombModel } from '@minesweeper/domain/models';
import { getRandomNumber, hasSamePosition } from '@minesweeper/utils';

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

    const bombAlreadyExists = bombs.some(bomb => hasSamePosition(bomb, newBomb));

    if (!bombAlreadyExists) bombs.push(newBomb);
  }
  return bombs;
};
