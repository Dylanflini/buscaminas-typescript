import { BoardModel, CellModel, FlagModel } from '@minesweeper/domain/models';
import { dataRepository } from '@minesweeper/infrastructure/data';
import { getPosition } from '@minesweeper/utils';
import { markFlagUseCase, MarkFlagUCError, GeneralError } from './markFlag';

jest.mock('@minesweeper/infrastructure/data');
jest.mock('@minesweeper/infrastructure/id/createId');

describe('markFlagUseCase', () => {
  /**
   * Mock Data
   */
  const boardId = '111-222-333';
  const flagAvailableMocked = 20;

  const boardMocked: BoardModel = {
    boardId,
    flags_available: flagAvailableMocked,
    bombs_available: 10,
    rows: 10,
    columns: 10,
    bombs: [{ position: [0, 0] }],
    cells: [{ position: [0, 0], exposed: false }],
    neighBorsBombsCounter: [{ position: [0, 0], quantity: 5 }],
    flags: [],
  };

  /**
   * Mock Implementation
   */

  (dataRepository.saveBoard as jest.Mock).mockImplementation(() => boardId);

  beforeEach(() => {
    (dataRepository.getBoard as jest.Mock).mockImplementation(() => boardMocked);
  });

  /**
   * Test commons
   */
  const commonProps = {
    boardId,
    dataRepository,
  };

  it('should mark a flag in the board', async () => {
    const { flags, flags_available } = await markFlagUseCase({ position: [5, 7], ...commonProps });
    expect(flags[0].position).toStrictEqual([5, 7]);
    expect(flags_available).toBe(flagAvailableMocked - 1);

    flagAvailableMocked;
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
      expect.objectContaining({ message: MarkFlagUCError.OUTSIDE_BOARD }),
    );

    await expect(markFlagUseCase({ position: [inside, outside], ...commonProps })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.OUTSIDE_BOARD }),
    );

    await expect(markFlagUseCase({ position: [outside, outside], ...commonProps })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.OUTSIDE_BOARD }),
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

    (dataRepository.getBoard as jest.Mock).mockImplementationOnce(() => ({
      ...boardMocked,
      flags_available: 0,
    }));

    await expect(markFlagUseCase({ position: [3, 4], ...commonProps })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.NO_FLAGS_AVAILABLE }),
    );
  });
  it('should not add a flag in a cell which is already exposed', async () => {
    const cellExposed: CellModel = {
      position: [2, 3],
      exposed: true,
    };

    await expect(markFlagUseCase({ position: [2, 10], ...commonProps })).resolves.toEqual(
      expect.objectContaining({
        flags: expect.arrayContaining<FlagModel>([getPosition(2, 10)]) as void,
      }),
    );

    (dataRepository.getBoard as jest.Mock).mockImplementationOnce(() => ({
      ...boardMocked,
      cells: [cellExposed],
    }));

    await expect(markFlagUseCase({ position: [2, 3], ...commonProps })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.CELL_ALREADY_EXPOSED }),
    );
  });
});
