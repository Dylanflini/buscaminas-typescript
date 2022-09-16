import { markFlagUseCase, MarkFlagUCError, GeneralError } from './markFlag';
import { BoardModel } from '@minesweeper/domain/Board.model';
import { CellModel } from '@minesweeper/domain/Cell.model';
import { dataRepository } from '@minesweeper/infrastructure/data';

jest.mock('@minesweeper/infrastructure/data');
jest.mock('@minesweeper/infrastructure/dependencies/uuid');

const boardId = { id: '111-222-333' };

const boardMocked: BoardModel = {
  id: '111-222-333',
  flag_available: 10,
  bombs_available: 10,
  rows: 10,
  columns: 10,
  bombs: [{ position: [0, 0] }],
  cells: [{ position: [0, 0], exposed: false }],
  neighBorsBombsCounter: [{ position: [0, 0], quantity: 5 }],
  flags: [],
};

describe('markFlagUseCase', () => {
  (dataRepository.getBoard as jest.Mock).mockImplementation(() => boardMocked);
  (dataRepository.saveBoard as jest.Mock).mockImplementation(() => boardId);

  it('should mark a flag in the board', async () => {
    const { flags } = await markFlagUseCase({ position: [5, 7], boardId });
    expect(flags[0].position).toStrictEqual([5, 7]);
  });
  it('should not add a flag in a position outside the limits of the board', async () => {
    const inside = 7;
    const outside = 20;

    await expect(markFlagUseCase({ position: [inside, inside], boardId })).resolves.toEqual(
      expect.objectContaining({ flags: [{ position: [inside, inside] }] }),
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
      expect.objectContaining({ flags: [{ position: [positive, positive] }] }),
    );

    await expect(markFlagUseCase({ position: [positive, zero], boardId })).resolves.toEqual(
      expect.objectContaining({ flags: [{ position: [positive, zero] }] }),
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

    const flagAdded = { flags: [{ position: [x, y] }] };

    await expect(markFlagUseCase({ position: [x, y], boardId })).resolves.toEqual(
      expect.objectContaining(flagAdded),
    );

    (dataRepository.getBoard as jest.Mock).mockImplementationOnce(() => ({
      ...boardMocked,
      ...flagAdded,
    }));

    await expect(markFlagUseCase({ position: [x, y], boardId })).rejects.toEqual(
      expect.objectContaining({ message: MarkFlagUCError.ALREADY_A_FLAG }),
    );
  });
  it('should not add a flag when there is no flag available', async () => {
    await expect(markFlagUseCase({ position: [1, 2], boardId })).resolves.toEqual(
      expect.objectContaining({ flags: [{ position: [1, 2] }] }),
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

    await expect(markFlagUseCase({ position: [2, 2], boardId })).resolves.toEqual(
      expect.objectContaining({ flags: [{ position: [2, 2] }] }),
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
