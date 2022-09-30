import { BoardModel, IPosition } from '@minesweeper/domain/models';
import { hasSamePosition, isNaturalNumber } from '@minesweeper/utils';

export class MinesweeperError extends Error {
  constructor(public message: string) {
    super();
    this.name = 'Minesweeper Game Error';
  }
}

export enum GeneralError {
  NOT_NATURAL_NUMBER = '[General Error] You only can add natural numbers (0,1,2,3,...)',
  CELL_ALREADY_EXPOSED = '[Error] You cannot do any action where there is an already exposed cell',
  OUTSIDE_BOARD = '[Error] You cannot do any action outside the columns and rows of the board',
}

/**
 * Generic Validation Types
 */
export type ValidationsList<Type extends string> = { [key in string as Type]: boolean };
export type ValidationType<PropsType, Type> = (props: PropsType, board: BoardModel) => Type;

/**
 * Types
 */
type TValidationsProps = ValidationsList<
  'OUTSIDE_BOARD' | 'CELL_ALREADY_EXPOSED' | 'NOT_NATURAL_NUMBER'
>;
type TMakeValidations = ValidationType<IPosition, TValidationsProps>;
type IRunValidationsProps = ValidationType<IPosition, void>;

/**
 * Validations
 */
export const makeValidations: TMakeValidations = (props, board) => {
  const [columnMarked, rowMarked] = props.position;

  return {
    OUTSIDE_BOARD: columnMarked > board.columns || rowMarked > board.rows,
    CELL_ALREADY_EXPOSED: board.cells.some(cell => cell.isExposed && hasSamePosition(cell, props)),
    NOT_NATURAL_NUMBER: !isNaturalNumber(columnMarked) || !isNaturalNumber(rowMarked),
  };
};

export const runValidations: IRunValidationsProps = (props, board) => {
  const { CELL_ALREADY_EXPOSED, OUTSIDE_BOARD, NOT_NATURAL_NUMBER } = makeValidations(props, board);

  if (CELL_ALREADY_EXPOSED) throw Error(GeneralError.CELL_ALREADY_EXPOSED);
  if (OUTSIDE_BOARD) throw Error(GeneralError.OUTSIDE_BOARD);
  if (NOT_NATURAL_NUMBER) throw Error(GeneralError.NOT_NATURAL_NUMBER);
};
