import { IRepositoryUseCase } from '@minesweeper/domain/data.repository';
import { IPosition, IBoardId, PublicBoardModel } from '@minesweeper/domain/models';
import { hasSamePosition } from '@minesweeper/utils';
import { makeValidations } from './unMarkFlag.validations';

export interface IMarkFlagProps extends IPosition, IRepositoryUseCase, IBoardId {}
export type IMarkFlagUseCase = (props: IMarkFlagProps) => Promise<PublicBoardModel>;

/**
 * [Use Case] unMark flag in a cell in the board in a specific
 * position to signal that there should be a bomb there.
 */
export const unMarkFlagUseCase: IMarkFlagUseCase = async props => {
  const { boardId, dataRepository, ...positionProps } = props;
  const board = await dataRepository.getBoard({ boardId });

  makeValidations(props, board);

  const indexFlag = board.flags.findIndex(flag => hasSamePosition(flag, positionProps));

  board.flags.splice(indexFlag, 1);
  board.flags_available = board.flags_available + 1;

  await dataRepository.saveBoard(board);

  return board;
};

export * from './unMarkFlag.validations';
