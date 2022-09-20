export enum ErrorStartGame {
  BOMBS_GREATER_THAN_ZERO = 'bombs must be greater than 0',
  ROWS_GREATER_THAN_ZERO = 'rows must be greater than 0',
  COLUMNS_GREATER_THAN_ZERO = 'columns must be greater than 0',
  ROWS_AND_COLUMNS_GREATER_THAN_ONE = 'rows and columns must be greater than 1',
  BOMBS_GREATER_THAN_TOTAL_CELLS = 'bombs must be less than total cells',
}

export const makeValidations = (bombsInput: number, rows: number, columns: number): void => {
  if (bombsInput < 1) throw Error(ErrorStartGame.BOMBS_GREATER_THAN_ZERO);

  if (rows < 1) throw Error(ErrorStartGame.ROWS_GREATER_THAN_ZERO);

  if (columns < 1) throw Error(ErrorStartGame.COLUMNS_GREATER_THAN_ZERO);

  if (rows < 2 && columns < 2) throw new Error(ErrorStartGame.ROWS_AND_COLUMNS_GREATER_THAN_ONE);

  if (bombsInput >= columns * rows) throw Error(ErrorStartGame.BOMBS_GREATER_THAN_TOTAL_CELLS);
};
