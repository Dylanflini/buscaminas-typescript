import { IncomingMessage, ServerResponse } from 'http';

export type RequestListener = (req: IncomingMessage, res: ServerResponse) => Promise<void> | void;
