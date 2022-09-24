import { IncomingMessage } from 'http';

export const getQueryParams = (req: IncomingMessage): URLSearchParams => {
  const { url } = req;

  if (!url) throw Error('asdasd');

  return new URLSearchParams(url.split('?')[1]);
};
