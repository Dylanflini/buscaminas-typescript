import { IncomingMessage, ServerResponse } from 'http';
import { RequestListener } from '../types';

export const Router = () => {
  const routes: Record<any, RequestListener> = {};

  const get = (route: string, callback: RequestListener) => {
    routes[`GET-${route}`] = callback;
  };
  const post = (route: string, callback: RequestListener) => {
    routes[`POST-${route}`] = callback;
  };

  const execRoute = async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
    const foundRoute = routes[`${req.method || ''}-${req.url || ''}`];

    if (typeof foundRoute === 'function') {
      await foundRoute(req, res);
      return true;
    }
    return false;
  };
  return {
    get,
    post,
    execRoute,
  };
};
