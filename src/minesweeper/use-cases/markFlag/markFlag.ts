import { IRepositoryUseCase } from '@minesweeper/domain/data.repository';
import { IPosition, IBoardId, PublicBoardModel } from '@minesweeper/domain/models';
import { runMarkFlagValidations } from './markFlag.validations';

export interface IMarkFlagProps extends IPosition, IRepositoryUseCase, IBoardId {}
export type IMarkFlagUseCase = (props: IMarkFlagProps) => Promise<PublicBoardModel>;

/**
 * [Use Case] Mark flag in a cell in the board in a specific
 * position to signal that there should be a bomb there.
 */
export const markFlagUseCase: IMarkFlagUseCase = async props => {
  const { boardId, dataRepository, ...positionProps } = props;
  const board = await dataRepository.getBoard({ boardId });

  runMarkFlagValidations(props, board);

  board.flags.push(positionProps); // not tested enough
  board.flags_available = board.flags_available - 1;

  await dataRepository.saveBoard(board);

  return board;
};

export * from './markFlag.validations';
