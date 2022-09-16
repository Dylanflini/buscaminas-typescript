import { BoardModel } from '@minesweeper/domain/Board.model';
import { CellModel } from '@minesweeper/domain/Cell.model';
import { FlagModel } from '@minesweeper/domain/Flag.model';
import { dataRepository } from '@minesweeper/infrastructure/data';

import { markFlagUseCase, MarkFlagUCError, GeneralError } from './markFlag';

jest.mock('@minesweeper/infrastructure/data');
jest.mock('@minesweeper/infrastructure/dependencies/uuid');

const getPosition = (column: number, row: number): FlagModel => ({ position: [column, row] }); // util to export

describe('markFlagUseCase', () => {
  /**
   * Mock Data
   */
  const boardId = { id: '111-222-333' };
  const flagAvailableMocked = 20;

  const boardMocked: BoardModel = {
    id: '111-222-333',
    flag_available: flagAvailableMocked,
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

  it('should mark a flag in the board', async () => {
    const { flags, flag_available } = await markFlagUseCase({ position: [5, 7], boardId });
    expect(flags[0].position).toStrictEqual([5, 7]);
    expect(flag_available).toBe(flagAvailableMocked - 1);

    flagAvailableMocked;
  });
  it('should not add a flag in a position outside the limits of the board', async () => {
    const inside = 7;
    const outside = 20;

    await expect(markFlagUseCase({ position: [inside, inside], boardId })).resolves.toEqual(
      expect.objectContaining({
        flags: expect.arrayContaining<FlagModel>([getPosition(inside, inside)]) as void,
      }),
    );

    await expect(markFlagUseCase({ position: [outside, inside], boardId })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.OUTSIDE_BOARD }),
    );

    await expect(markFlagUseCase({ position: [inside, outside], boardId })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.OUTSIDE_BOARD }),
    );

    await expect(markFlagUseCase({ position: [outside, outside], boardId })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.OUTSIDE_BOARD }),
    );
  });

  it('should only allows natural numbers as props', async () => {
    const positive = 2;
    const negative = -2;
    const zero = 0;
    const decimal = 2.5;

    await expect(markFlagUseCase({ position: [positive, positive], boardId })).resolves.toEqual(
      expect.objectContaining({
        flags: expect.arrayContaining<FlagModel>([getPosition(positive, positive)]) as void,
      }),
    );

    await expect(markFlagUseCase({ position: [positive, zero], boardId })).resolves.toEqual(
      expect.objectContaining({
        flags: expect.arrayContaining<FlagModel>([getPosition(positive, zero)]) as void,
      }),
    );

    await expect(markFlagUseCase({ position: [negative, positive], boardId })).rejects.toEqual(
      expect.objectContaining({ message: GeneralError.NOT_NATURAL_NUMBER }),
    );

    await expect(markFlagUseCase({ position: [positive, negative], boardId })).rejects.toEqual(
      expect.objectContaining({ message: GeneralError.NOT_NATURAL_NUMBER }),
    );

    await expect(markFlagUseCase({ position: [positive, decimal], boardId })).rejects.toEqual(
      expect.objectContaining({ message: GeneralError.NOT_NATURAL_NUMBER }),
    );

    await expect(markFlagUseCase({ position: [negative, negative], boardId })).rejects.toEqual(
      expect.objectContaining({ message: GeneralError.NOT_NATURAL_NUMBER }),
    );
  });
  it('should not add a flag where there is already a flag', async () => {
    const x = 2;
    const y = 4;

    await expect(markFlagUseCase({ position: [x, y], boardId })).resolves.toEqual(
      expect.objectContaining({
        flags: expect.arrayContaining<FlagModel>([getPosition(x, y)]) as void,
      }),
    );

    await expect(markFlagUseCase({ position: [x, y], boardId })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.ALREADY_A_FLAG }),
    );
  });
  it('should not add a flag when there is no flag available', async () => {
    await expect(markFlagUseCase({ position: [1, 2], boardId })).resolves.toEqual(
      expect.objectContaining({
        flags: expect.arrayContaining<FlagModel>([getPosition(1, 2)]) as void,
      }),
    );

    (dataRepository.getBoard as jest.Mock).mockImplementationOnce(() => ({
      ...boardMocked,
      flag_available: 0,
    }));

    await expect(markFlagUseCase({ position: [3, 4], boardId })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.NO_FLAGS_AVAILABLE }),
    );
  });
  it('should not add a flag in a cell which is already exposed', async () => {
    const cellExposed: CellModel = {
      position: [2, 3],
      exposed: true,
    };

    await expect(markFlagUseCase({ position: [2, 10], boardId })).resolves.toEqual(
      expect.objectContaining({
        flags: expect.arrayContaining<FlagModel>([getPosition(2, 10)]) as void,
      }),
    );

    (dataRepository.getBoard as jest.Mock).mockImplementationOnce(() => ({
      ...boardMocked,
      cells: [cellExposed],
    }));

    await expect(markFlagUseCase({ position: [2, 3], boardId })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.CELL_ALREADY_EXPOSED }),
    );
  });
});
