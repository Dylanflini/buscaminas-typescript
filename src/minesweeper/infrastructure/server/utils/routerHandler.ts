import { IncomingMessage, ServerResponse } from 'http';
import { RequestListener } from '../types';
import { ServerError, ServerErrorMessages } from './validations';

export const Router = () => {
  const routes: Record<any, RequestListener> = {};

  const get = (route: string, callback: RequestListener) => {
    routes[`GET-${route}`] = callback;
  };
  const post = (route: string, callback: RequestListener) => {
    routes[`POST-${route}`] = callback;
  };

  const execRoute = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const foundRoute = routes[`${req.method || ''}-${req.url || ''}`];

    if (typeof foundRoute === 'function') {
      await foundRoute(req, res);
    }

    throw new ServerError(404, ServerErrorMessages.NOT_FOUND);
  };
  return {
    get,
    post,
    execRoute,
  };
};
