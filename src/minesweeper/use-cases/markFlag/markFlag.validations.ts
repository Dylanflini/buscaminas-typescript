import { BoardModel } from '@minesweeper/domain/models';
import { hasSamePosition, isNaturalNumber } from '@minesweeper/utils';
import { IMarkFlagProps } from './markFlag';

export enum GeneralError {
  NOT_NATURAL_NUMBER = '[General Error] You only can add natural numbers (0,1,2,3,...)',
}

export enum MarkFlagUCError {
  OUTSIDE_BOARD = "[Error] You can't add a flag outside the columns and rows of the board",
  ALREADY_A_FLAG = "[Error] You can't add a flag where there is already a flag",
  CELL_ALREADY_EXPOSED = "[Error] You can't add a flag where there is a exposed cell",
  NO_FLAGS_AVAILABLE = "[Error] You can't add a flag when you there is no flags available",
}

export const makeValidations = (props: IMarkFlagProps, board: BoardModel): void => {
  const [columnMarked, rowMarked] = props.position;

  if (board.flags.some(flag => hasSamePosition(flag, props)))
    throw Error(MarkFlagUCError.ALREADY_A_FLAG);

  if (board.cells.some(cell => cell.isExposed && hasSamePosition(cell, props)))
    throw Error(MarkFlagUCError.CELL_ALREADY_EXPOSED);

  if (board.flags_available === 0) throw Error(MarkFlagUCError.NO_FLAGS_AVAILABLE);

  if (columnMarked > board.columns || rowMarked > board.rows)
    throw Error(MarkFlagUCError.OUTSIDE_BOARD);

  if (!isNaturalNumber(columnMarked) || !isNaturalNumber(rowMarked))
    throw Error(GeneralError.NOT_NATURAL_NUMBER);
};
