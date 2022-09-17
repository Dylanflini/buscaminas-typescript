import { BoardModel } from '@minesweeper/domain/models';
import { IDataRepository } from '@minesweeper/domain/data.repository';
import { createId } from '@minesweeper/infrastructure/dependencies/uuid';

let db: BoardModel;

export const dataRepository: IDataRepository = {
  saveBoard: async board => {
    const id = createId();

    db = { ...board, id };

    return { id };
  },

  getBoard: async ({ id }) => {
    return db;
  },
};
