import { BoardModel } from '@minesweeper/domain/models';
import { IBoardId } from '@minesweeper/domain/models/Board.model';

export interface IDataRepository {
  saveBoard: (props: BoardModel) => Promise<void>;
  createBoard: (props: Omit<BoardModel, 'boardId'>) => Promise<IBoardId>;
  getBoard: (props: IBoardId) => Promise<BoardModel>;
}

/**
 * Whenever an use case needs to connect to the data repository
 * this interface provides an standard way to do it.
 *
 * This is required in each case for ensuring standardization
 */
export interface IRepositoryUseCase {
  dataRepository: IDataRepository;
}
