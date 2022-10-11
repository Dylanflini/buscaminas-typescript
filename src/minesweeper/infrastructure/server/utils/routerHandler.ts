import { RequestListener } from '../types';
import { ServerError, ServerErrorMessages } from './validations';

enum Methods {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
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

  const patch: RouteHandler = (url, callback) => {
    routes.push({ method: Methods.PATCH, url, callback });
  };

  const execRoute: RequestListener = (request, response) => {
    const url = request.url || '';
    const host = request.headers.host || '';

    const { pathname } = new URL(url, `http://${host}`);

    const hasRoute = routes.some(({ url }) => url === pathname);
    const foundRoute = routes.find(
      ({ method, url }) => method === request.method && url === pathname,
    );

    if (hasRoute) {
      if (foundRoute) {
        return foundRoute.callback(request, response);
      }

      throw new ServerError(405, ServerErrorMessages.METHOD_NOT_ALLOWED);
    }

    throw new ServerError(404, ServerErrorMessages.NOT_FOUND);
  };
  return {
    get,
    post,
    patch,
    execRoute,
  };
};
