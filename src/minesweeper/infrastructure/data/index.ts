import { BoardModel } from '@minesweeper/domain/models';
import { IDataRepository } from '@minesweeper/domain/data.repository';
import { createId } from '@minesweeper/infrastructure/id/createId';

let db: BoardModel;

const resolve = (resolved: unknown) =>
  new Promise(resolve => {
    resolve(resolved);
  });

export const dataRepository: IDataRepository = {
  saveBoard: async board => {
    await resolve(board);
    db = board;
  },

  createBoard: async board => {
    const boardId = (await resolve(createId())) as string;

    db = { ...board, boardId };

    return { boardId };
  },

  getBoard: async ({ boardId }) => {
    await resolve(db);
    return db;
  },
};
