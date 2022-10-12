import { BoardModel } from '@minesweeper/domain/models';
import { hasSamePosition } from '@minesweeper/utils';
import { runValidations } from '../validations';
import { IMarkFlagProps } from './unMarkFlag';

export enum MarkFlagUCError {
  NOT_EXISTS_A_FLAG = "[Error] You can't unMark flag where not exists a flag",
  NO_FLAGS = "[Error] You can't unMark flag when there is no flags",
}

export const makeValidations = (props: IMarkFlagProps, board: BoardModel): void => {
  runValidations(props, board);

  if (board.flags.length <= 0) throw Error(MarkFlagUCError.NO_FLAGS);

  if (!board.flags.some(flag => hasSamePosition(flag, props)))
    throw Error(MarkFlagUCError.NOT_EXISTS_A_FLAG);
};
