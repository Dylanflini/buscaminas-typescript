import { IncomingMessage } from 'http';

export const getQueryParams = (request: IncomingMessage): URLSearchParams => {
  const { url } = request;

  if (!url) throw Error('error');

  return new URLSearchParams(url.split('?')[1]);
};
