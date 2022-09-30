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
    console.log({ db });
  },

  createBoard: async board => {
    const boardId = (await resolve(createId())) as string;
    // console.log({ board });
    db = { ...board, boardId };
    console.log({ db });

    return { boardId };
  },

  getBoard: async ({ boardId }) => {
    await resolve(db);
    console.log({ db });
    return db;
  },
};
