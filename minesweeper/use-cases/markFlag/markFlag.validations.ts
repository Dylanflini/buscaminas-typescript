import { IPosition } from '@minesweeper/domain/commons.type';
import { IMarkFlagProps, IMarkFlagResponse } from './markFlag';

export const isNaturalNumber = (value: number) => {
  const absoluteValue = Math.abs(value);
  const integerValue = parseInt(value.toString(), 10);
  return integerValue === value && integerValue === absoluteValue && absoluteValue === value;
};

export enum GeneralError {
  NOT_NATURAL_NUMBER = '[General Error] You only can add natural numbers (0,1,2,3,...)',
}

export enum MarkFlagUCError {
  OUTSIDE_BOARD = "[Error] You can't add a flag outside the columns and rows of the board",
  ALREADY_A_FLAG = "[Error] You can't add a flag where there is already a flag",
  CELL_ALREADY_EXPOSED = "[Error] You can't add a flag where there is a exposed cell",
  NO_FLAGS_AVAILABLE = "[Error] You can't add a flag when you there is no flags available",
}

export const makeValidations = (props: IMarkFlagProps, board: IMarkFlagResponse) => {
  const [columnMarked, rowMarked] = props.position;
  const samePosition = ({ position: [column, row] }: IPosition) =>
    column === columnMarked && row === rowMarked;
  return {
    OUTSIDE_BOARD: columnMarked > board.columns || rowMarked > board.rows,
    ALREADY_A_FLAG: board.flags.some(flag => samePosition(flag)),
    CELL_ALREADY_EXPOSED: board.cells.some(
      cell => (cell.adjacentBombs !== undefined || cell.isBomb !== undefined) && samePosition(cell),
    ),
    NO_FLAGS_AVAILABLE: board.flags_available === 0,
    NOT_NATURAL_NUMBER: !isNaturalNumber(columnMarked) || !isNaturalNumber(rowMarked),
  };
};
