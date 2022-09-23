import { RequestListener } from '@minesweeper/infrastructure/server/types';

export const healthController: RequestListener = (_, res) => {
  res.statusCode = 200;
  res.write(JSON.stringify({ status: 'up' }));
  res.end();
};
