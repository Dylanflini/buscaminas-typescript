import { hasSamePosition } from '@minesweeper/utils';
import { ValidationsList, ValidationType, runValidations } from '../validations';
import { IMarkFlagProps } from './markFlag';

export enum MarkFlagUCError {
  ALREADY_A_FLAG = "[Error] You can't add a flag where there is already a flag",
  NO_FLAGS_AVAILABLE = "[Error] You can't add a flag when you there is no flags available",
}

type TMarkFlagValidationsProps = ValidationsList<'ALREADY_A_FLAG' | 'NO_FLAGS_AVAILABLE'>;
type TMarkFlagValidations = ValidationType<IMarkFlagProps, TMarkFlagValidationsProps>;
type IRunValidationsProps = ValidationType<IMarkFlagProps, void>;

export const makeMarkFlagValidations: TMarkFlagValidations = (props, board) => ({
  ALREADY_A_FLAG: board.flags.some(flag => hasSamePosition(flag, props)),
  NO_FLAGS_AVAILABLE: board.flags_available === 0,
});

export const runMarkFlagValidations: IRunValidationsProps = (props, board) => {
  runValidations(props, board);

  const { ALREADY_A_FLAG, NO_FLAGS_AVAILABLE } = makeMarkFlagValidations(props, board);

  if (ALREADY_A_FLAG) throw Error(MarkFlagUCError.ALREADY_A_FLAG);
  if (NO_FLAGS_AVAILABLE) throw Error(MarkFlagUCError.NO_FLAGS_AVAILABLE);
};
