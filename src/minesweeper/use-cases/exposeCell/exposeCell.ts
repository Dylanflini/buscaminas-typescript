import { IRepositoryUseCase } from '@minesweeper/domain/data.repository';
import { IPosition, IBoardId, PublicBoardModel } from '@minesweeper/domain/models';
import { hasSamePosition, hasSomeWithSamePosition } from '@minesweeper/utils';
import { repeatablyExposeEmptyCells, updateStateOfAdjacentCells } from './exposeCell.helpers';
import { runExposeCellValidations, runExposeCellCases } from './exposeCell.validations';

export interface IExposeCellProps extends IPosition, IRepositoryUseCase, IBoardId {}
export type IExposeCellUseCase = (props: IExposeCellProps) => Promise<PublicBoardModel>;

/**
 * [Use Case] Mark flag in a cell in the board in a specific
 * position to signal that there should be a bomb there.
 */
export const exposeCellUseCase: IExposeCellUseCase = async props => {
  const { boardId, dataRepository, ...position } = props;
  const board = await dataRepository.getBoard({ boardId });

  runExposeCellValidations(props, board);

  board.cells = board.cells.map(cell => {
    const isCellExposing = hasSamePosition(position, cell);
    const hasBomb = hasSomeWithSamePosition(board.bombs, cell);

    cell.hasBomb = isCellExposing ? hasBomb : cell.hasBomb;

    if (!isCellExposing || hasBomb) return cell;
    updateStateOfAdjacentCells(board, cell);

    return cell;
  });

  repeatablyExposeEmptyCells(board);

  runExposeCellCases(props, board);

  await dataRepository.saveBoard(board);

  return board;
};

export * from './exposeCell.validations';
