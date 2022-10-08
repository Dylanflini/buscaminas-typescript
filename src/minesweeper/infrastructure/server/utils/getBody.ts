import { IncomingMessage } from 'http';

export type UnknownObject = Record<string, unknown>;

const getBody = async (request: IncomingMessage): Promise<Record<string, unknown>> =>
  new Promise((resolve, reject) => {
    let data = '';
    request.on('data', chunk => (data += chunk));
    request.on('error', error => reject(error));
    request.on('end', () => {
      resolve(JSON.parse(data) as Record<string, unknown>);
    });
  });

export default getBody;
