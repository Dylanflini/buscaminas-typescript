import { RequestListener } from '../types';
import { ServerError, ServerErrorMessages } from './validations';

enum Methods {
  GET = 'GET',
  POST = 'POST',
}

interface Route {
  method: Methods;
  url: string;
  callback: RequestListener;
}

type RouteHandler = (url: string, callback: RequestListener) => void;

export const Router = () => {
  const routes: Route[] = [];

  const get: RouteHandler = (url, callback) => {
    routes.push({ method: Methods.GET, url, callback });
  };

  const post: RouteHandler = (url, callback) => {
    routes.push({ method: Methods.POST, url, callback });
  };

  const execRoute: RequestListener = (req, res) => {
    const url = req.url || '';
    const host = req.headers.host || '';

    const { pathname } = new URL(url, `http://${host}`);

    const hasRoute = routes.some(({ url }) => url === pathname);
    const foundRoute = routes.find(({ method, url }) => method === req.method && url === pathname);

    if (hasRoute) {
      if (foundRoute) {
        return foundRoute.callback(req, res);
      }

      throw new ServerError(405, ServerErrorMessages.METHOD_NOT_ALLOWED);
    }

    throw new ServerError(404, ServerErrorMessages.NOT_FOUND);
  };
  return {
    get,
    post,
    execRoute,
  };
};
