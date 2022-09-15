import { BombModel } from '@minesweeper/domain/Bomb.model';

const getRandomNumber = (max: number): number => Math.round(Math.random() * max);

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

    const haveSamePosition = bombs.some(
      bomb => bomb.position[0] === newBomb.position[0] && bomb.position[1] === newBomb.position[1],
    );

    if (!haveSamePosition) {
      bombs.push(newBomb);
    }
  }
  return bombs;
};
