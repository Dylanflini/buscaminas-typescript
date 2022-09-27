import { IncomingMessage } from 'http';

const getBody = async (readableStream: IncomingMessage): Promise<any> =>
  new Promise((resolve, reject) => {
    let data = '';
    readableStream.on('data', chunk => (data += chunk));
    readableStream.on('error', error => reject(error));
    readableStream.on('end', () => {
      resolve(JSON.parse(data));
    });
  });

export default getBody;
