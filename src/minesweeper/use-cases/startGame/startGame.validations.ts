import { MinesweeperError } from '../validations';

export enum StartGameErrorMessages {
  BOMBS_GREATER_THAN_ZERO = 'bombs must be greater than 0',
  ROWS_GREATER_THAN_ZERO = 'rows must be greater than 0',
  COLUMNS_GREATER_THAN_ZERO = 'columns must be greater than 0',
  BOMBS_LESS_THAN_TOTAL_CELLS = 'bombs must be less than total cells',
  BOMBS_IS_INTEGER = 'bombs must be a integer number',
  ROWS_IS_INTEGER = 'rows must be a integer number',
  COLUMNS_IS_INTEGER = 'columns must be a integer number',
}

export const makeValidations = (bombsInput: number, rows: number, columns: number): void => {
  if (!Number.isInteger(bombsInput))
    throw new MinesweeperError(StartGameErrorMessages.BOMBS_IS_INTEGER);

  if (!Number.isInteger(rows)) throw new MinesweeperError(StartGameErrorMessages.ROWS_IS_INTEGER);

  if (!Number.isInteger(columns))
    throw new MinesweeperError(StartGameErrorMessages.COLUMNS_IS_INTEGER);

  if (bombsInput < 1) throw new MinesweeperError(StartGameErrorMessages.BOMBS_GREATER_THAN_ZERO);

  if (rows < 1) throw new MinesweeperError(StartGameErrorMessages.ROWS_GREATER_THAN_ZERO);

  if (columns < 1) throw new MinesweeperError(StartGameErrorMessages.COLUMNS_GREATER_THAN_ZERO);

  if (bombsInput >= columns * rows)
    throw new MinesweeperError(StartGameErrorMessages.BOMBS_LESS_THAN_TOTAL_CELLS);
};
