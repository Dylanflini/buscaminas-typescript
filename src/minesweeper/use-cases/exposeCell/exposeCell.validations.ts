import { ValidationsList, ValidationType, runValidations } from '../validations';
import { IExposeCellProps } from './exposeCell';

export enum ExposeCellUCCases {
  LOST_GAME = '[Case] Game Lost',
  WON_GAME = '[Case] Game Won',
}

type TExposeCellValidationsProps = ValidationsList<'LOST_GAME' | 'WON_GAME'>;
type TExposeCellValidations = ValidationType<IExposeCellProps, TExposeCellValidationsProps>;
type IRunValidationsProps = ValidationType<IExposeCellProps, void>;

export const makeExposeCellValidations: TExposeCellValidations = (props, board) => {
  const thereIsExposedCellWithBomb = board.cells.some(cell => cell.isExposed && cell.hasBomb);

  return {
    LOST_GAME: thereIsExposedCellWithBomb,
    WON_GAME: !thereIsExposedCellWithBomb && board.cells.every(cell => cell.isExposed),
  };
};

export const runExposeCellValidations: IRunValidationsProps = (props, board) => {
  runValidations(props, board);
};

export const runExposeCellCases: IRunValidationsProps = (props, board) => {
  const { LOST_GAME, WON_GAME } = makeExposeCellValidations(props, board);

  if (LOST_GAME) throw Error(ExposeCellUCCases.LOST_GAME);
  if (WON_GAME) throw Error(ExposeCellUCCases.WON_GAME);
};
