import { IDataRepository } from '@minesweeper/domain/data.repository';
import { Cell } from '@minesweeper/domain/models';
import { dataRepository } from '@minesweeper/infrastructure/data';
import { ErrorStartGame, startGameUseCase } from './startGame';

describe('start game', () => {
  const data: IDataRepository = dataRepository; // esto despues se debe cambiar por un mock

  describe('props validations', () => {
    it('should throw error if props columns or rows are not valid', async () => {
      await expect(startGameUseCase({ data, bombs: 1, columns: 1, rows: 1 })).rejects.toThrowError(
        ErrorStartGame.ROWS_AND_COLUMNS_GREATER_THAN_ONE,
      );
    });

    it('should throw error if props columns or rows are less than 1', async () => {
      await expect(startGameUseCase({ data, bombs: 1, columns: 4, rows: 0 })).rejects.toThrowError(
        ErrorStartGame.ROWS_GREATER_THAN_ZERO,
      );

      await expect(startGameUseCase({ data, bombs: 1, columns: 4, rows: -1 })).rejects.toThrowError(
        ErrorStartGame.ROWS_GREATER_THAN_ZERO,
      );

      await expect(startGameUseCase({ data, bombs: 1, columns: 0, rows: 3 })).rejects.toThrowError(
        ErrorStartGame.COLUMNS_GREATER_THAN_ZERO,
      );

      await expect(startGameUseCase({ data, bombs: 1, columns: -1, rows: 3 })).rejects.toThrowError(
        ErrorStartGame.COLUMNS_GREATER_THAN_ZERO,
      );
    });

    it('should throw error if props not contain bombs', async () => {
      const props = { data, bombs: 0, rows: 2, columns: 2 };

      await expect(startGameUseCase(props)).rejects.toThrowError(
        ErrorStartGame.BOMBS_GREATER_THAN_ZERO,
      );
    });

    it('should throw error if bombs are greater or equal than total cells', async () => {
      await expect(startGameUseCase({ data, bombs: 4, rows: 2, columns: 2 })).rejects.toThrowError(
        ErrorStartGame.BOMBS_GREATER_THAN_TOTAL_CELLS,
      );

      await expect(startGameUseCase({ data, bombs: 5, rows: 2, columns: 2 })).rejects.toThrowError(
        ErrorStartGame.BOMBS_GREATER_THAN_TOTAL_CELLS,
      );
    });
  });

  it('should return initial board', async () => {
    const props = { data, bombs: 2, columns: 3, rows: 2 };

    const { id, cells, columns, rows, bombs_available, flags_available, flags } =
      await startGameUseCase(props);

    expect(id).toBeTruthy();
    expect(id).not.toBe('');
    expect(cells.length).toBe(props.columns * props.rows);

    expect(bombs_available).toBe(props.bombs);

    expect(columns).toBe(props.columns);
    expect(rows).toBe(props.rows);

    expect(flags_available).toBe(props.bombs);
    expect(flags.length).toBe(0);

    // expect(neighBorsBombsCounter.length).toBe(props.columns * props.rows);
  });

  it('should return initial cells', async () => {
    const props = { data, bombs: 1, rows: 3, columns: 2 };

    const { cells } = await startGameUseCase(props);

    expect(cells).toStrictEqual([
      new Cell([0, 0]),
      new Cell([1, 0]),
      new Cell([2, 0]),
      new Cell([0, 1]),
      new Cell([1, 1]),
      new Cell([2, 1]),
    ]);
  });

  it('should all cells not to initialize exposed', async () => {
    const props = { data, bombs: 2, columns: 3, rows: 2 };

    const { cells } = await startGameUseCase(props);

    const match = cells.every(
      ({ adjacentBombs, hasBomb }) => adjacentBombs === undefined && hasBomb === undefined,
    );

    expect(match).toBe(true);
  });

  it('should throw error if error happens saving data of db', async () => {
    const data: IDataRepository = {
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

    const props = { data, bombs: 1, columns: 3, rows: 5 };

    await expect(startGameUseCase(props)).rejects.toThrowError(ErrorStartGame.DB_ERROR);
  });
});
