import { IncomingMessage } from 'http';

const getBody = async (request: IncomingMessage): Promise<any> =>
  new Promise((resolve, reject) => {
    let data = '';
    request.on('data', chunk => (data += chunk));
    request.on('error', error => reject(error));
    request.on('end', () => {
      resolve(JSON.parse(data));
    });
  });

export default getBody;
