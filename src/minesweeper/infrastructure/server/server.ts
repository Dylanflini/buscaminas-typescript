import { createServer } from 'http';
import { requestHandler } from './requestHandler';

const server = createServer(requestHandler);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log('server started in port', port);
});
