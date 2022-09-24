import { IncomingMessage, ServerResponse } from 'http';

// interface SearchParams {
//   searchParams: URLSearchParams;
// }

// interface Request extends IncomingMessage, SearchParams {}

export type RequestListener = (req: IncomingMessage, res: ServerResponse) => Promise<void> | void;
