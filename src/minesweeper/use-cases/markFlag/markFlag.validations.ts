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

export const makeValidations = (element: IMarkFlagProps, board: BoardModel) => {
  const [columnMarked, rowMarked] = element.position;

  return {
    OUTSIDE_BOARD: columnMarked > board.columns || rowMarked > board.rows,
    ALREADY_A_FLAG: board.flags.some(flag => hasSamePosition(flag.position, element.position)),
    CELL_ALREADY_EXPOSED: board.cells.some(
      cell => cell.exposed && hasSamePosition(cell.position, element.position),
    ),
    NO_FLAGS_AVAILABLE: board.flags_available === 0,
    NOT_NATURAL_NUMBER: !isNaturalNumber(columnMarked) || !isNaturalNumber(rowMarked),
  };
};
