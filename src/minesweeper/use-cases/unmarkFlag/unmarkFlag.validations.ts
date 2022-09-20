import { BoardModel } from '@minesweeper/domain/models';
import { hasSamePosition, isNaturalNumber } from '@minesweeper/utils';
import { IMarkFlagProps } from './unMarkFlag';

export enum GeneralError {
  NOT_NATURAL_NUMBER = '[General Error] You only can add natural numbers (0,1,2,3,...)',
}

export enum MarkFlagUCError {
  OUTSIDE_BOARD = "[Error] You can't add a flag outside the columns and rows of the board",
  NOT_EXISTS_A_FLAG = "[Error] You can't unMark flag where not exists a flag",
  CELL_ALREADY_EXPOSED = "[Error] You can't add a flag where there is a exposed cell",
  NO_FLAGS = "[Error] You can't unMark flag when you there is no flags",
}

export const makeValidations = (props: IMarkFlagProps, board: BoardModel): void => {
  const [columnMarked, rowMarked] = props.position;

  if (columnMarked > board.columns || rowMarked > board.rows)
    throw Error(MarkFlagUCError.OUTSIDE_BOARD);

  if (!isNaturalNumber(columnMarked) || !isNaturalNumber(rowMarked))
    throw Error(GeneralError.NOT_NATURAL_NUMBER);

  if (board.flags.length <= 0) throw Error(MarkFlagUCError.NO_FLAGS);

  if (!board.flags.some(flag => hasSamePosition(flag, props)))
    throw Error(MarkFlagUCError.NOT_EXISTS_A_FLAG);

  if (board.cells.some(cell => cell.isExposed && hasSamePosition(cell, props)))
    throw Error(MarkFlagUCError.CELL_ALREADY_EXPOSED);
};
