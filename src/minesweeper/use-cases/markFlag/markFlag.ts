import { IRepositoryUseCase } from '@minesweeper/domain/data.repository';
import { IPosition, IBoardId, PublicBoardModel } from '@minesweeper/domain/models';
import { makeValidations, MarkFlagUCError, GeneralError } from './markFlag.validations';

export interface IMarkFlagProps extends IPosition, IRepositoryUseCase, IBoardId {}
export type IMarkFlagUseCase = (props: IMarkFlagProps) => Promise<PublicBoardModel>;

/**
 * [Use Case] Mark flag in a cell in the board in a specific
 * position to signal that there should be a bomb there.
 */
export const markFlagUseCase: IMarkFlagUseCase = async props => {
  const { boardId, dataRepository, ...positionProps } = props;
  const board = await dataRepository.getBoard({ boardId });

  const {
    ALREADY_A_FLAG,
    CELL_ALREADY_EXPOSED,
    NO_FLAGS_AVAILABLE,
    OUTSIDE_BOARD,
    NOT_NATURAL_NUMBER,
  } = makeValidations(props, board);

  if (ALREADY_A_FLAG) throw Error(MarkFlagUCError.ALREADY_A_FLAG);
  if (CELL_ALREADY_EXPOSED) throw Error(MarkFlagUCError.CELL_ALREADY_EXPOSED);
  if (NO_FLAGS_AVAILABLE) throw Error(MarkFlagUCError.NO_FLAGS_AVAILABLE);
  if (OUTSIDE_BOARD) throw Error(MarkFlagUCError.OUTSIDE_BOARD);
  if (NOT_NATURAL_NUMBER) throw Error(GeneralError.NOT_NATURAL_NUMBER);

  board.flags.push(positionProps); // not tested enough
  board.flags_available = board.flags_available - 1;

  await dataRepository.saveBoard(board);

  return board;
};

export * from './markFlag.validations';
