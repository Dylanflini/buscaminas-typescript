import { RequestListener } from '@minesweeper/infrastructure/server/types';

export const healthController: RequestListener = (_, response) => {
  response.statusCode = 200;
  response.write(JSON.stringify({ status: 'up' }));
  response.end();
};
