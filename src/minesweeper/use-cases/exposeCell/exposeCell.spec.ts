import { dataRepository } from '@minesweeper/infrastructure/data';
import { startGameUseCase } from '@minesweeper/use-cases/startGame/startGame';
import { boardId } from '@minesweeper/utils/mocks';
import * as numberUtils from '@minesweeper/utils/numbers/numbers';
import { ExposeCellUCCases, exposeCellUseCase } from './exposeCell';

describe('Expose cell', () => {
  const commonProps = {
    boardId,
    dataRepository,
  };

  describe('With a bomb there', () => {
    it('Should lost the game when exposing a cell with a bomb there', async () => {
      (numberUtils.getRandomNumber as jest.Mock) = jest.fn().mockReturnValue(0);

      const props = { dataRepository, bombs: 1, columns: 3, rows: 3 };

      await startGameUseCase(props);

      // const { cells } = await exposeCellUseCase({ position: [1, 0], ...commonProps });

      // expect(cells[0].hasBomb).toBeUndefined();
      // expect(cells[1].hasBomb).toBeDefined();

      await expect(exposeCellUseCase({ position: [0, 0], ...commonProps })).rejects.toEqual(
        expect.objectContaining({ message: ExposeCellUCCases.LOST_GAME }),
      );
    });
  });
  describe('Without a bomb there', () => {
    it('Should expose all adjacent cells if there is not bombs in none of there sides', async () => {
      (numberUtils.getRandomNumber as jest.Mock) = jest.fn().mockReturnValue(2);

      const props = { dataRepository, bombs: 1, columns: 3, rows: 3 };

      await startGameUseCase(props);
      const { cells } = await exposeCellUseCase({ position: [0, 0], ...commonProps });

      expect(cells[0].isExposed).toBeTruthy(); // 0 0 Selected
      expect(cells[1].isExposed).toBeTruthy(); // 1 0
      expect(cells[3].isExposed).toBeTruthy(); // 0 1
      expect(cells[4].isExposed).toBeTruthy(); // 1 1
    });

    it.todo(
      '[Complex] Should expose all adjacent cells indefinitely if there is not bombs in none of there sides until a cell with bombs in any of its sides is found',
    );
    it('Should show the number with the quantity of adjacent bombs of a cell if there are bombs in any of its sides', async () => {
      (numberUtils.getRandomNumber as jest.Mock) = jest.fn().mockReturnValue(2); // Bomb will be in 2,2

      const props = { dataRepository, bombs: 1, columns: 3, rows: 3 };

      await startGameUseCase(props);
      const { cells } = await exposeCellUseCase({ position: [0, 0], ...commonProps });

      expect(cells[0].adjacentBombs).toBe(0);
      expect(cells[1].adjacentBombs).toBe(0);
      expect(cells[3].adjacentBombs).toBe(0);
      expect(cells[4].adjacentBombs).toBe(1);
    });
    it('Should win the game when exposing the last cell without bombs', async () => {
      (numberUtils.getRandomNumber as jest.Mock) = jest.fn().mockReturnValue(2); // Bomb will be in 1,1

      const props = { dataRepository, bombs: 1, columns: 2, rows: 2 };

      await startGameUseCase(props);

      await expect(exposeCellUseCase({ position: [0, 0], ...commonProps })).rejects.toEqual(
        expect.objectContaining({ message: ExposeCellUCCases.WON_GAME }),
      );
    });
  });
});

// 3. El jugador expone una celda del tablero
//     1. Cuando esto ocurre pueden darse los siguientes casos
//         1. La celda se expone con una bomba en ella
//             1. Si esto ocurre **se pierde el juego**
//         2. La celda se expone sin una bomba en ella
//             1. Si dicha celda no tiene bombas en algunos de sus lados adyancentes se expone todas las celdas adyacentes
//                 1. Esto hace repetir el caso indicado (2.b) en las celdas adyacentes tantas veces como se cumpla la condición hasta que ocurra el caso subsiguiente a este (2.b.i.2.b)
//             2. Si dicha celda tiene bombas en algunos de sus lados adyancentes se muestra el número de la cantidad de bombas que tiene a su alrededor
//             3. Si dicha celda es la última celda sin bombas se gana el juego
