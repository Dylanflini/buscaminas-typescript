import { IncomingMessage } from 'http';

const getBody = async (request: IncomingMessage): Promise<Record<string, unknown> | null> =>
  new Promise((resolve, reject) => {
    let data = '';
    request.on('data', chunk => (data += chunk));
    request.on('error', error => reject(error));
    request.on('end', () => {
      if (!data) return resolve(null);
      resolve(JSON.parse(data) as Record<string, unknown>);
    });
  });

export default getBody;
