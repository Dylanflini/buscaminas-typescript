import { IDataRepository } from '@minesweeper/domain/data.repository';
import { Cell } from '@minesweeper/domain/models';
import { dataRepository } from '@minesweeper/infrastructure/data';
import { startGameUseCase } from './startGame';
import { ErrorStartGame } from './startGame.validations';

describe('start game', () => {
  describe('props validations', () => {
    it('should throw error if props columns or rows are not valid', async () => {
      await expect(
        startGameUseCase({ dataRepository, bombs: 1, columns: 1, rows: 1 }),
      ).rejects.toThrowError(ErrorStartGame.ROWS_AND_COLUMNS_GREATER_THAN_ONE);
    });

    it('should throw error if props columns or rows are less than 1', async () => {
      await expect(
        startGameUseCase({ dataRepository, bombs: 1, columns: 4, rows: 0 }),
      ).rejects.toThrowError(ErrorStartGame.ROWS_GREATER_THAN_ZERO);

      await expect(
        startGameUseCase({ dataRepository, bombs: 1, columns: 4, rows: -1 }),
      ).rejects.toThrowError(ErrorStartGame.ROWS_GREATER_THAN_ZERO);

      await expect(
        startGameUseCase({ dataRepository, bombs: 1, columns: 0, rows: 3 }),
      ).rejects.toThrowError(ErrorStartGame.COLUMNS_GREATER_THAN_ZERO);

      await expect(
        startGameUseCase({ dataRepository, bombs: 1, columns: -1, rows: 3 }),
      ).rejects.toThrowError(ErrorStartGame.COLUMNS_GREATER_THAN_ZERO);
    });

    it('should throw error if props not contain bombs', async () => {
      const props = { dataRepository, bombs: 0, rows: 2, columns: 2 };

      await expect(startGameUseCase(props)).rejects.toThrowError(
        ErrorStartGame.BOMBS_GREATER_THAN_ZERO,
      );
    });

    it('should throw error if bombs are greater or equal than total cells', async () => {
      await expect(
        startGameUseCase({ dataRepository, bombs: 4, rows: 2, columns: 2 }),
      ).rejects.toThrowError(ErrorStartGame.BOMBS_GREATER_THAN_TOTAL_CELLS);

      await expect(
        startGameUseCase({ dataRepository, bombs: 5, rows: 2, columns: 2 }),
      ).rejects.toThrowError(ErrorStartGame.BOMBS_GREATER_THAN_TOTAL_CELLS);
    });
  });

  it('should return initial board', async () => {
    const props = { dataRepository, bombs: 2, columns: 3, rows: 2 };

    const { boardId, cells, flags_available, flags } = await startGameUseCase(props);

    expect(boardId).toBeTruthy();
    expect(boardId).not.toBe('');
    expect(cells.length).toBe(props.columns * props.rows);

    expect(flags_available).toBe(props.bombs);
    expect(flags.length).toBe(0);
  });

  it('should return initial cells', async () => {
    // same test in createCells test
    const props = { dataRepository, bombs: 1, rows: 3, columns: 2 };

    const { cells } = await startGameUseCase(props);

    expect(cells).toStrictEqual([
      new Cell([0, 0]),
      new Cell([1, 0]),
      new Cell([0, 1]),
      new Cell([1, 1]),
      new Cell([0, 2]),
      new Cell([1, 2]),
    ]);
  });

  it('should all cells not to initialize exposed', async () => {
    const props = { dataRepository, bombs: 2, columns: 3, rows: 2 };

    const { cells } = await startGameUseCase(props);

    expect(cells.every(({ isExposed }) => !isExposed)).toBe(true);
  });

  // this test must be in data Repository tests
  it.skip('should throw error if error happens saving data of db', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined); // Avoid console.error of DB_ERROR

    const dataRepositoryMocked: IDataRepository = {
      createBoard: () => {
        throw Error('something wrong!!');
      },
      getBoard: () => {
        throw Error('something wrong!!');
      },
      saveBoard: () => {
        throw Error('something wrong!!');
      },
    };

    const props = { dataRepository: dataRepositoryMocked, bombs: 1, columns: 3, rows: 5 };

    await expect(startGameUseCase(props)).rejects.toThrowError('some db error');
  });
});
