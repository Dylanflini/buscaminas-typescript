import { BoardModel } from '@minesweeper/domain/Board.model';
import { IDataRepository } from '@minesweeper/domain/data.repository';
// import { createId } from '@minesweeper/infrastructure/dependencies/uuid';

let db: BoardModel;

export const dataRepository: IDataRepository = {
  saveBoard: async board => {
    const id = '111'; // createId(); error in jest test

    db = { ...board, id };

    return { id };
  },

  getBoard: async ({ id }) => {
    return db;
  },
};
