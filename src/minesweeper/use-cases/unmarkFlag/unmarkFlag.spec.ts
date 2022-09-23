import { IDataRepository } from '@minesweeper/domain/data.repository';
import { BoardModel, Cell } from '@minesweeper/domain/models';
import { dataRepository } from '@minesweeper/infrastructure/data';
import { unMarkFlagUseCase, MarkFlagUCError } from './unMarkFlag';
import { boardId, boardMocked } from '@minesweeper/utils/mocks';
import { GeneralError } from '../validations';

describe('unMarkFlagUseCase', () => {
  /**
   * Mock Data
   */
  const flagAvailableMocked = 1;

  /**
   * Test commons
   */

  const newDataRepository: IDataRepository = {
    ...dataRepository,
    saveBoard: () => Promise.resolve(),
    getBoard: () =>
      Promise.resolve({
        ...boardMocked,
        flags_available: flagAvailableMocked,
        flags: [{ position: [0, 0] }, { position: [1, 0] }],
      }),
  };

  const commonProps = {
    boardId,
    dataRepository: newDataRepository,
  };

  it('should unMark a flag in the board in a cell that has flag', async () => {
    const { flags, flags_available } = await unMarkFlagUseCase({
      position: [0, 0],
      ...commonProps,
    });

    expect(flags).toHaveLength(1);
    expect(flags).toStrictEqual([{ position: [1, 0] }]);
    expect(flags_available).toBe(flagAvailableMocked + 1);
  });

  it('should unMark a flag in a position inside the limits of the boards', async () => {
    const inside = 7;

    const board: BoardModel = {
      ...boardMocked,
      flags: [{ position: [inside, inside] }, { position: [inside + 1, inside + 1] }],
    };

    const newDataRepository: IDataRepository = {
      ...dataRepository,
      saveBoard: () => Promise.resolve(),
      getBoard: () => Promise.resolve(board),
    };

    const { flags } = await unMarkFlagUseCase({
      position: [inside, inside],
      boardId,
      dataRepository: newDataRepository,
    });

    expect(flags).toStrictEqual([{ position: [inside + 1, inside + 1] }]);
  });

  it.each([
    [20, 7],
    [7, 20],
    [20, 20],
  ])(
    'should not unMark flag in a position outside the limits of the board - (test n %#)',
    async (x, y) => {
      await expect(unMarkFlagUseCase({ position: [x, y], ...commonProps })).rejects.toThrowError(
        GeneralError.OUTSIDE_BOARD,
      );
    },
  );

  it.each([
    [-2, 2],
    [2, -2],
    [2, 2.5],
    [-2, -2],
  ])('should only allows natural numbers as props - (test n %#)', async (x, y) => {
    await expect(unMarkFlagUseCase({ position: [x, y], ...commonProps })).rejects.toThrowError(
      GeneralError.NOT_NATURAL_NUMBER,
    );
  });

  it('should not unMark flag where not exists a flag', async () => {
    const x = 2;
    const y = 4;

    await expect(unMarkFlagUseCase({ position: [x, y], ...commonProps })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.NOT_EXISTS_A_FLAG }),
    );
  });

  it('should not unMark a flag when no exists flags in board', async () => {
    const board: BoardModel = {
      ...boardMocked,
      flags: [],
    };

    const newDataRepository: IDataRepository = {
      ...dataRepository,
      saveBoard: () => Promise.resolve(),
      getBoard: () => Promise.resolve(board),
    };

    await expect(
      unMarkFlagUseCase({ position: [3, 4], boardId, dataRepository: newDataRepository }),
    ).rejects.toThrowError(MarkFlagUCError.NO_FLAGS);
  });

  const cases: Cell[][] = [
    [new Cell([2, 3], { adjacentBombs: 0 })],
    [new Cell([2, 3], { adjacentBombs: 3 })],
    [new Cell([2, 3], { hasBomb: false })],
    [new Cell([2, 3], { hasBomb: true })],
  ];

  it.each(cases)(
    'should not unMark a flag in a cell which is already exposed - (test n %#)',
    async cellExposed => {
      const newBoardMocked: BoardModel = {
        ...boardMocked,
        flags: [{ position: [2, 3] }],
        cells: [cellExposed],
      };

      const newDataRepository: IDataRepository = {
        ...dataRepository,
        saveBoard: () => Promise.resolve(),
        getBoard: () => Promise.resolve(newBoardMocked),
      };

      await expect(
        unMarkFlagUseCase({
          position: [2, 3],
          boardId,
          dataRepository: newDataRepository,
        }),
      ).rejects.toEqual(expect.objectContaining({ message: GeneralError.CELL_ALREADY_EXPOSED }));
    },
  );
});
