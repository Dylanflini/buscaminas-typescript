import { IDataRepository } from '@minesweeper/domain/data.repository';
import { BoardModel, Cell, FlagModel } from '@minesweeper/domain/models';
import { dataRepository } from '@minesweeper/infrastructure/data';
import { getPosition } from '@minesweeper/utils';
import { boardId, boardMocked, flagAvailableMocked } from '@minesweeper/utils/mocks';
import { GeneralError } from '../validations';
import { markFlagUseCase, MarkFlagUCError } from './markFlag';

describe('markFlagUseCase', () => {
  /**
   * Test commons
   */

  const newDataRepository: IDataRepository = {
    ...dataRepository,
    saveBoard: () => Promise.resolve(),
    getBoard: () => Promise.resolve(boardMocked),
  };

  const commonProps = {
    boardId,
    dataRepository: newDataRepository,
  };

  it('should mark a flag in the board', async () => {
    const { flags, flags_available } = await markFlagUseCase({ position: [5, 7], ...commonProps });
    expect(flags[0].position).toStrictEqual([5, 7]);
    expect(flags_available).toBe(flagAvailableMocked - 1);
  });
  it('should not add a flag in a position outside the limits of the board', async () => {
    const inside = 7;
    const outside = 20;

    await expect(markFlagUseCase({ position: [inside, inside], ...commonProps })).resolves.toEqual(
      expect.objectContaining({
        flags: expect.arrayContaining<FlagModel>([getPosition(inside, inside)]) as void,
      }),
    );

    await expect(markFlagUseCase({ position: [outside, inside], ...commonProps })).rejects.toEqual(
      expect.objectContaining({ message: GeneralError.OUTSIDE_BOARD }),
    );

    await expect(markFlagUseCase({ position: [inside, outside], ...commonProps })).rejects.toEqual(
      expect.objectContaining({ message: GeneralError.OUTSIDE_BOARD }),
    );

    await expect(markFlagUseCase({ position: [outside, outside], ...commonProps })).rejects.toEqual(
      expect.objectContaining({ message: GeneralError.OUTSIDE_BOARD }),
    );
  });

  it('should only allows natural numbers as props', async () => {
    const positive = 2;
    const negative = -2;
    const zero = 0;
    const decimal = 2.5;

    await expect(
      markFlagUseCase({ position: [positive, positive], ...commonProps }),
    ).resolves.toEqual(
      expect.objectContaining({
        flags: expect.arrayContaining<FlagModel>([getPosition(positive, positive)]) as void,
      }),
    );

    await expect(markFlagUseCase({ position: [positive, zero], ...commonProps })).resolves.toEqual(
      expect.objectContaining({
        flags: expect.arrayContaining<FlagModel>([getPosition(positive, zero)]) as void,
      }),
    );

    await expect(
      markFlagUseCase({ position: [negative, positive], ...commonProps }),
    ).rejects.toEqual(expect.objectContaining({ message: GeneralError.NOT_NATURAL_NUMBER }));

    await expect(
      markFlagUseCase({ position: [positive, negative], ...commonProps }),
    ).rejects.toEqual(expect.objectContaining({ message: GeneralError.NOT_NATURAL_NUMBER }));

    await expect(
      markFlagUseCase({ position: [positive, decimal], ...commonProps }),
    ).rejects.toEqual(expect.objectContaining({ message: GeneralError.NOT_NATURAL_NUMBER }));

    await expect(
      markFlagUseCase({ position: [negative, negative], ...commonProps }),
    ).rejects.toEqual(expect.objectContaining({ message: GeneralError.NOT_NATURAL_NUMBER }));
  });
  it('should not add a flag where there is already a flag', async () => {
    const x = 2;
    const y = 4;

    await expect(markFlagUseCase({ position: [x, y], ...commonProps })).resolves.toEqual(
      expect.objectContaining({
        flags: expect.arrayContaining<FlagModel>([getPosition(x, y)]) as void,
      }),
    );

    await expect(markFlagUseCase({ position: [x, y], ...commonProps })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.ALREADY_A_FLAG }),
    );
  });
  it('should not add a flag when there is no flag available', async () => {
    await expect(markFlagUseCase({ position: [1, 2], ...commonProps })).resolves.toEqual(
      expect.objectContaining({
        flags: expect.arrayContaining<FlagModel>([getPosition(1, 2)]) as void,
      }),
    );

    const newBoardMocked: BoardModel = {
      ...boardMocked,
      flags_available: 0,
    };

    const newDataRepository: IDataRepository = {
      ...dataRepository,
      saveBoard: () => Promise.resolve(),
      getBoard: () => Promise.resolve(newBoardMocked),
    };

    await expect(
      markFlagUseCase({ position: [3, 4], boardId, dataRepository: newDataRepository }),
    ).rejects.toEqual(expect.objectContaining({ message: MarkFlagUCError.NO_FLAGS_AVAILABLE }));
  });

  const cases: Cell[][] = [
    [new Cell([2, 3], { adjacentBombs: 0 })],
    [new Cell([2, 3], { adjacentBombs: 3 })],
    [new Cell([2, 3], { hasBomb: false })],
    [new Cell([2, 3], { hasBomb: true })],
  ];

  it.each(cases)(
    'should not add a flag in a cell which is already exposed - (test n %#)',
    async cellExposed => {
      const newBoardMocked: BoardModel = {
        ...boardMocked,
        cells: [cellExposed],
      };

      const newDataRepository: IDataRepository = {
        ...dataRepository,
        saveBoard: () => Promise.resolve(),
        getBoard: () => Promise.resolve(newBoardMocked),
      };

      await expect(
        markFlagUseCase({
          position: [2, 3],
          boardId,
          dataRepository: newDataRepository,
        }),
      ).rejects.toEqual(expect.objectContaining({ message: GeneralError.CELL_ALREADY_EXPOSED }));
    },
  );
});
