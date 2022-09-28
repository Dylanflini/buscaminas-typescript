import { dataRepository } from '@minesweeper/infrastructure/data';
import { RequestListener } from '@minesweeper/infrastructure/server/types';
import { exposeCellUseCase } from '@minesweeper/use-cases/exposeCell/exposeCell';

export const exposeCellController: RequestListener = async (_, response) => {
  const board = await exposeCellUseCase({ boardId: '123123', position: [1, 0], dataRepository });
  response.statusCode = 200;
  response.write(JSON.stringify({ board }));
  response.end();
};
