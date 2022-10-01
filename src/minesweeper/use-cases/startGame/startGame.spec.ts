import { IDataRepository } from '@minesweeper/domain/data.repository';
import { Cell } from '@minesweeper/domain/models';
import { dataRepository } from '@minesweeper/infrastructure/data';
import { MinesweeperError } from '../validations';
import { startGameUseCase } from './startGame';
import { StartGameErrorMessages } from './startGame.validations';

describe('start game', () => {
  describe('props validations', () => {
    it.each([[NaN], [0.5], [Infinity], [-Infinity]])(
      'should throw error if bombs parameter is not a integer number',
      async bombs => {
        await expect(
          startGameUseCase({ dataRepository, bombs, columns: 4, rows: 0 }),
        ).rejects.toThrowError(StartGameErrorMessages.BOMBS_IS_INTEGER);
      },
    );

    it.each([[NaN], [0.5], [Infinity], [-Infinity]])(
      'should throw error if rows parameter is not a integer number',
      async rows => {
        await expect(
          startGameUseCase({ dataRepository, bombs: 1, columns: 4, rows }),
        ).rejects.toThrowError(StartGameErrorMessages.ROWS_IS_INTEGER);
      },
    );

    it.each([[NaN], [0.5], [Infinity], [-Infinity]])(
      'should throw error if columns parameter is not a integer number',
      async columns => {
        await expect(
          startGameUseCase({ dataRepository, bombs: 1, columns, rows: 3 }),
        ).rejects.toThrowError(StartGameErrorMessages.COLUMNS_IS_INTEGER);
      },
    );

    it('should throw error if props columns or rows are less than 1', async () => {
      await expect(
        startGameUseCase({ dataRepository, bombs: 1, columns: 4, rows: 0 }),
      ).rejects.toBeInstanceOf(MinesweeperError);

      await expect(
        startGameUseCase({ dataRepository, bombs: 1, columns: 4, rows: 0 }),
      ).rejects.toThrowError(StartGameErrorMessages.ROWS_GREATER_THAN_ZERO);

      await expect(
        startGameUseCase({ dataRepository, bombs: 1, columns: 4, rows: -1 }),
      ).rejects.toThrowError(StartGameErrorMessages.ROWS_GREATER_THAN_ZERO);

      await expect(
        startGameUseCase({ dataRepository, bombs: 1, columns: 0, rows: 3 }),
      ).rejects.toBeInstanceOf(MinesweeperError);

      await expect(
        startGameUseCase({ dataRepository, bombs: 1, columns: 0, rows: 3 }),
      ).rejects.toThrowError(StartGameErrorMessages.COLUMNS_GREATER_THAN_ZERO);

      await expect(
        startGameUseCase({ dataRepository, bombs: 1, columns: -1, rows: 3 }),
      ).rejects.toThrowError(StartGameErrorMessages.COLUMNS_GREATER_THAN_ZERO);
    });

    it('should throw error if props not contain bombs', async () => {
      const fn = () => startGameUseCase({ dataRepository, bombs: 0, rows: 2, columns: 2 });

      await expect(fn).rejects.toBeInstanceOf(MinesweeperError);
      await expect(fn).rejects.toThrowError(StartGameErrorMessages.BOMBS_GREATER_THAN_ZERO);
    });

    it.each([
      [{ bombs: 1, rows: 1, columns: 1 }],
      [{ bombs: 4, rows: 2, columns: 2 }],
      [{ bombs: 5, rows: 2, columns: 2 }],
    ])('should throw error if bombs are greater or equal than total cells', async params => {
      await expect(startGameUseCase({ dataRepository, ...params })).rejects.toBeInstanceOf(
        MinesweeperError,
      );

      await expect(startGameUseCase({ dataRepository, ...params })).rejects.toThrowError(
        StartGameErrorMessages.BOMBS_LESS_THAN_TOTAL_CELLS,
      );
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
