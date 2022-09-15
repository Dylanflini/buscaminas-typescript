import { BoardModel } from './Board.model';
import { IBoardId } from './commons.type';

export interface IDataRepository {
  createBoard: (props: Omit<BoardModel, 'id'>) => Promise<IBoardId>;
  getBoard: (props: IBoardId) => Promise<BoardModel>;
}
