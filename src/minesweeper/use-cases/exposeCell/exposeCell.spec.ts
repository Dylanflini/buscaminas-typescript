import { IDataRepository } from '@minesweeper/domain/data.repository';
import { BoardModel, BombModel } from '@minesweeper/domain/models';
import { dataRepository } from '@minesweeper/infrastructure/data';
import { boardId, boardMocked } from '@minesweeper/utils/mocks';
import { createCells } from '../startGame/createCells/createCells';
import { createNeighborsCounter } from '../startGame/createNeighborsCounter/createNeighborsCounter';
import { ExposeCellUCCases, exposeCellUseCase } from './exposeCell';

describe('Expose cell', () => {
  describe('With a bomb there', () => {
    it('Should lost the game when exposing a cell with a bomb there', async () => {
      const newBoard: BoardModel = {
        ...boardMocked,
        cells: createCells({ rows: 3, columns: 3 }),
        bombs: [{ position: [0, 0] }],
      };

      const newDataRepository: IDataRepository = {
        ...dataRepository,
        getBoard: () => Promise.resolve(newBoard),
      };

      await expect(
        exposeCellUseCase({ position: [0, 0], dataRepository: newDataRepository, boardId }),
      ).rejects.toEqual(expect.objectContaining({ message: ExposeCellUCCases.LOST_GAME }));
    });
  });

  describe('Without a bomb there', () => {
    it('Should expose all adjacent cells if there is not bombs in none of there sides', async () => {
      const bombs: BombModel[] = [{ position: [2, 2] }];
      const boardCells = createCells({ rows: 3, columns: 3 });

      const newBoard: BoardModel = {
        ...boardMocked,
        bombs,
        cells: boardCells,
        neighBorsBombsCounter: createNeighborsCounter({ bombs, cells: boardCells }),
      };
      const newDataRepository: IDataRepository = {
        ...dataRepository,
        getBoard: () => Promise.resolve(newBoard),
      };

      const { cells } = await exposeCellUseCase({
        position: [0, 0],
        dataRepository: newDataRepository,
        boardId,
      });

      expect(cells[0].isExposed).toBeTruthy(); // 0 0 Selected
      expect(cells[1].isExposed).toBeTruthy(); // 1 0
      expect(cells[3].isExposed).toBeTruthy(); // 0 1
      expect(cells[4].isExposed).toBeTruthy(); // 1 1
    });

    it('Should expose all adjacent cells indefinitely if there is not bombs in none of there sides until a cell with bombs in any of its sides is found', async () => {
      const bombs: BombModel[] = [{ position: [2, 2] }];
      const boardCells = createCells({ rows: 3, columns: 4 });

      const newBoard: BoardModel = {
        ...boardMocked,
        bombs,
        cells: boardCells,
        neighBorsBombsCounter: createNeighborsCounter({ bombs, cells: boardCells }),
      };

      const newDataRepository: IDataRepository = {
        ...dataRepository,
        getBoard: () => Promise.resolve(newBoard),
      };

      const { cells } = await exposeCellUseCase({
        position: [0, 0],
        dataRepository: newDataRepository,
        boardId,
      });

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
      const bombs: BombModel[] = [{ position: [2, 2] }];
      const boardCells = createCells({ rows: 3, columns: 3 });

      const newBoard: BoardModel = {
        ...boardMocked,
        bombs,
        cells: boardCells,
        neighBorsBombsCounter: createNeighborsCounter({ bombs, cells: boardCells }),
      };

      const newDataRepository: IDataRepository = {
        ...dataRepository,
        getBoard: () => Promise.resolve(newBoard),
      };

      const {
        cells: [cell0x0, cell1x0, cell2x0, cell0x1, cell1x1, cell2x1, cell0x2, cell1x2, cell2x2],
      } = await exposeCellUseCase({ position: [0, 0], dataRepository: newDataRepository, boardId });

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
      const bombs: BombModel[] = [{ position: [2, 2] }]; // revisar, la bomba esta fuera del tablero
      const boardCells = createCells({ rows: 2, columns: 2 });

      const newBoard: BoardModel = {
        ...boardMocked,
        bombs,
        cells: boardCells,
        neighBorsBombsCounter: createNeighborsCounter({ bombs, cells: boardCells }),
      };

      const newDataRepository: IDataRepository = {
        ...dataRepository,
        getBoard: () => Promise.resolve(newBoard),
      };

      await expect(
        exposeCellUseCase({ position: [0, 0], dataRepository: newDataRepository, boardId }),
      ).rejects.toEqual(expect.objectContaining({ message: ExposeCellUCCases.WON_GAME }));
    });
  });
});
