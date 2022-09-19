import { IRepositoryUseCase } from '@minesweeper/domain/data.repository';
import { IPosition, IBoardId, PublicBoardModel, Cell } from '@minesweeper/domain/models';
import { getAdjacentVertex, hasSamePosition } from '@minesweeper/utils';
import { createNeighborsCounter } from '../startGame/createNeighborsCounter/createNeighborsCounter';
import { runExposeCellValidations, runExposeCellCases } from './exposeCell.validations';

export interface IExposeCellProps extends IPosition, IRepositoryUseCase, IBoardId {}
export type IExposeCellUseCase = (props: IExposeCellProps) => Promise<PublicBoardModel>;

/**
 * [Use Case] Mark flag in a cell in the board in a specific
 * position to signal that there should be a bomb there.
 */
export const exposeCellUseCase: IExposeCellUseCase = async props => {
  const { boardId, dataRepository, ...positionProps } = props;
  const board = await dataRepository.getBoard({ boardId });

  runExposeCellValidations(props, board);

  const neighborsCounter = createNeighborsCounter({
    cells: board.cells,
    bombs: board.bombs,
  });

  board.cells = board.cells.map(cell => {
    if (!hasSamePosition(positionProps, cell)) return cell;

    const cellOnBomb = board.bombs.some(bomb => hasSamePosition(bomb, cell));
    cell.hasBomb = cellOnBomb;

    if (cellOnBomb) return cell; // If this happens game is lost. That will be checked in runExposeCellCases()

    const adjacentCells = getAdjacentVertex(board.cells, cell);

    adjacentCells.map(adjacentCell => {
      const matchedCounter = neighborsCounter.find(counter =>
        hasSamePosition(counter, adjacentCell),
      );
      if (matchedCounter) adjacentCell.adjacentBombs = matchedCounter.quantity;
      return adjacentCell;
    });

    return cell;
  });

  runExposeCellCases(props, board);

  await dataRepository.saveBoard(board);

  return board;
};

export * from './exposeCell.validations';
