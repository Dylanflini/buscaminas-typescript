import { RequestListener } from '@minesweeper/infrastructure/server/types';

export const healthController: RequestListener = (_, res) => {
  res.statusCode = 200;
  res.setHeader('content-type', 'application/json');
  res.write(JSON.stringify({ status: 'up' }));
  res.end();
};
