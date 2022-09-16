import { BoardModel } from '@minesweeper/domain/Board.model';
import { IBoardId, IPosition } from '@minesweeper/domain/commons.type';

import { dataRepository } from '@minesweeper/infrastructure/data';

import { makeValidations, MarkFlagUCError, GeneralError } from './markFlag.validations';

export interface WithBoardId {
  // export to commons
  boardId: IBoardId;
}

export interface IMarkFlagProps extends IPosition, WithBoardId {}

export type IMarkFlagResponse = BoardModel;
export type IMarkFlagUseCase = (props: IMarkFlagProps) => Promise<IMarkFlagResponse>;

/**
 * Mark flag in board
 */
export const markFlagUseCase: IMarkFlagUseCase = async props => {
  const { boardId, ...positionProps } = props;
  const board = await dataRepository.getBoard(boardId);

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
  board.flag_available = board.flag_available - 1;

  await dataRepository.saveBoard(board);

  return board;
};

export * from './markFlag.validations';
