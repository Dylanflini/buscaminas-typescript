import { IncomingMessage } from 'http';

import { dataRepository } from '@minesweeper/infrastructure/data';
import { RequestListener } from '@minesweeper/infrastructure/server/types';
import { exposeCellUseCase } from '@minesweeper/use-cases/exposeCell/exposeCell';
import getBody from '@minesweeper/infrastructure/server/utils/getBody';

export const patchCellController: RequestListener = async (request, response) => {
  const board = await exposeCellUseCase({ boardId: '123123', position: [1, 0], dataRepository });

  const requestBody = getBody(request);

  console.log(requestBody);

  response.statusCode = 200;
  response.write(JSON.stringify({ board }));
  response.end();
};
