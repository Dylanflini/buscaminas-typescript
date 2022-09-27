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

    it('Should expose all adjacent cells indefinitely if there is not bombs in none of there sides until a cell with bombs in any of its sides is found', async () => {
      (numberUtils.getRandomNumber as jest.Mock) = jest.fn().mockReturnValue(2);

      const props = { dataRepository, bombs: 1, columns: 4, rows: 3 };

      await startGameUseCase(props);
      const { cells } = await exposeCellUseCase({ position: [0, 0], ...commonProps });

      const [
        cell0x0,
        cell1x0,
        cell2x0,
        cell3x0,

        cell0x1,
        cell1x1,
        cell2x1,
        cell3x1,

        cell0x2,
        cell1x2,
        cell2x2,
        cell3x2,
      ] = cells;

      /**
       * X|0|0|0
       * 0|1|1|1
       * 0|1|B|?
       */

      /**
       * 0x0|1x0|2x0|3x0
       * 0x1|1x1|2x1|3x1
       * 0x2|1x2|2x2|3x2
       */

      // Selected
      expect(cell0x0.isExposed).toBeTruthy();

      // Neighbors
      expect(cell1x0.isExposed).toBeTruthy();
      expect(cell0x1.isExposed).toBeTruthy();
      expect(cell1x1.isExposed).toBeTruthy();

      // Strangers
      expect(cell2x0.isExposed).toBeTruthy();
      expect(cell3x0.isExposed).toBeTruthy();

      expect(cell2x1.isExposed).toBeTruthy();
      expect(cell3x1.isExposed).toBeTruthy();

      expect(cell0x2.isExposed).toBeTruthy();
      expect(cell1x2.isExposed).toBeTruthy();

      // Not exposed
      expect(cell2x2.isExposed).toBeFalsy();
      expect(cell3x2.isExposed).toBeFalsy();
    });
    it('Should show the number with the quantity of adjacent bombs of a cell if there are bombs in any of its sides', async () => {
      (numberUtils.getRandomNumber as jest.Mock) = jest.fn().mockReturnValue(2); // Bomb will be in 2,2

      const props = { dataRepository, bombs: 1, columns: 3, rows: 3 };

      await startGameUseCase(props);
      const {
        cells: [cell0x0, cell1x0, cell2x0, cell0x1, cell1x1, cell2x1, cell0x2, cell1x2, cell2x2],
      } = await exposeCellUseCase({ position: [0, 0], ...commonProps });

      /**
       * X|0|0
       * 0|1|1
       * 0|1|B
       */

      /**
       * 0x0|1x0|2x0
       * 0x1|1x1|2x1
       * 0x2|1x2|2x2
       */

      expect(cell0x0.adjacentBombs).toBe(0);
      expect(cell1x0.adjacentBombs).toBe(0);
      expect(cell2x0.adjacentBombs).toBe(0);

      expect(cell0x1.adjacentBombs).toBe(0);
      expect(cell1x1.adjacentBombs).toBe(1);
      expect(cell2x1.adjacentBombs).toBe(1);

      expect(cell0x2.adjacentBombs).toBe(0);
      expect(cell1x2.adjacentBombs).toBe(1);
      expect(cell2x2.adjacentBombs).toBeUndefined();
      expect(cell2x2.hasBomb).toBeUndefined();
      expect(cell2x2.isExposed).toBe(false);
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
