import { BoardModel } from '@minesweeper/domain/models';
import { IBoardId } from '@minesweeper/domain/commons.type';

export interface IDataRepository {
  saveBoard: (props: Omit<BoardModel, 'id'>) => Promise<IBoardId>;
  getBoard: (props: IBoardId) => Promise<BoardModel>;
}
