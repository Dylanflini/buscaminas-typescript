import { IDataRepository } from "@minesweeper/domain/data.repository";
import { dataRepository } from "@minesweeper/infrastructure/data";
import { ErrorStartGame, startGameUseCase } from "./startGame";

describe("start game", () => {
  const data: IDataRepository = dataRepository; // esto despues se debe cambiar por un mock

  describe("props validations", () => {
    it("should throw error if props columns or rows are not valid", async () => {
      await expect(
        startGameUseCase({ data, bombs: 1, columns: 1, rows: 1 })
      ).rejects.toThrowError(ErrorStartGame.ROWS_AND_COLUMNS_GREATER_THAN_ONE);
    });

    it("should throw error if props columns or rows are less than 1", async () => {
      await expect(
        startGameUseCase({ data, bombs: 1, columns: 4, rows: 0 })
      ).rejects.toThrowError(ErrorStartGame.ROWS_GREATER_THAN_ZERO);

      await expect(
        startGameUseCase({ data, bombs: 1, columns: 4, rows: -1 })
      ).rejects.toThrowError(ErrorStartGame.ROWS_GREATER_THAN_ZERO);

      await expect(
        startGameUseCase({ data, bombs: 1, columns: 0, rows: 3 })
      ).rejects.toThrowError(ErrorStartGame.COLUMNS_GREATER_THAN_ZERO);

      await expect(
        startGameUseCase({ data, bombs: 1, columns: -1, rows: 3 })
      ).rejects.toThrowError(ErrorStartGame.COLUMNS_GREATER_THAN_ZERO);
    });

    it("should throw error if props not contain bombs", async () => {
      const props = { data, bombs: 0, rows: 2, columns: 2 };

      await expect(startGameUseCase(props)).rejects.toThrowError(
        ErrorStartGame.BOMBS_GREATER_THAN_ZERO
      );
    });

    it("should throw error if bombs are greater or equal than total cells", async () => {
      await expect(
        startGameUseCase({ data, bombs: 4, rows: 2, columns: 2 })
      ).rejects.toThrowError(ErrorStartGame.BOMBS_GREATER_THAN_TOTAL_CELLS);

      await expect(
        startGameUseCase({ data, bombs: 5, rows: 2, columns: 2 })
      ).rejects.toThrowError(ErrorStartGame.BOMBS_GREATER_THAN_TOTAL_CELLS);
    });
  });

  it("should return initial board", async () => {
    const props = { data, bombs: 2, columns: 3, rows: 2 };

    const {
      id,
      cells,
      columns,
      rows,
      bombs_available,
      flag_available,
      flags,
      bombs,
      neighBorsBombsCounter,
    } = await startGameUseCase(props);

    expect(id).toBeTruthy();
    expect(id).not.toBe("");
    expect(cells.length).toBe(props.columns * props.rows);

    expect(bombs_available).toBe(props.bombs);
    expect(bombs.length).toBe(props.bombs);

    expect(columns).toBe(props.columns);
    expect(rows).toBe(props.rows);

    expect(flag_available).toBe(props.bombs);
    expect(flags.length).toBe(0);

    // expect(neighBorsBombsCounter.length).toBe(props.columns * props.rows);
  });

  it("should return initial cells", async () => {
    const props = { data, bombs: 1, rows: 3, columns: 2 };

    const { cells } = await startGameUseCase(props);

    expect(cells).toStrictEqual([
      { exposed: false, position: [0, 0] },
      { exposed: false, position: [1, 0] },
      { exposed: false, position: [2, 0] },
      { exposed: false, position: [0, 1] },
      { exposed: false, position: [1, 1] },
      { exposed: false, position: [2, 1] },
    ]);
  });

  it("should all cells not to initilize exposed", async () => {
    const props = { data, bombs: 2, columns: 3, rows: 2 };

    const { cells } = await startGameUseCase(props);

    const match = cells.every(({ exposed }) => exposed === false);

    expect(match).toBe(true);
  });

  it("should create 1 bomb", async () => {
    const props = { data, bombs: 1, rows: 2, columns: 2 };

    const { bombs } = await startGameUseCase(props);
    // hay que tener ojo porque al ser random puede que en algunas ocasiones pase y otras no,
    // pero no se como evitar eso en el test

    // ver que no sean bombas vacias
    expect(bombs[0].position).toBeTruthy();

    const [x, y] = bombs[0].position;

    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThan(props.rows);

    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThan(props.columns);
  });

  it('The bombs shouldn"t have the same position that other bombs', async () => {
    const props = { data, bombs: 2, columns: 3, rows: 2 };

    const { bombs } = await startGameUseCase(props);

    // ver que no sean bombas vacias
    expect(bombs[0].position).toBeTruthy();

    const match = bombs.some((bomb, bombIndex) => {
      const [bombX, bombY] = bomb.position;
      return bombs.some(({ position }, index) => {
        const [x, y] = position;
        return x === bombX && y === bombY && bombIndex !== index;
      });
    });

    expect(match).toBe(false);
  });

  it.todo("should all neighbors have value between 0 to 8");
  it.todo("should return 3 if initial bombs is 1 and row and column 2");
});
