import { RequestListener } from '../types';
import { ServerError, ServerErrorMessages } from './validations';

enum Methods {
  GET = 'GET',
  POST = 'POST',
}

interface Route {
  method: Methods;
  route: string;
  callback: RequestListener;
}

type RouteHandler = (route: string, callback: RequestListener) => void;

export const Router = () => {
  const routes: Route[] = [];

  const get: RouteHandler = (route, callback) => {
    routes.push({ method: Methods.GET, route, callback });
  };

  const post: RouteHandler = (route, callback) => {
    routes.push({ method: Methods.POST, route, callback });
  };

  const execRoute: RequestListener = (req, res) => {
    const foundRoute = routes.find(
      ({ method, route }) => method === req.method && route === req.url,
    );

    if (foundRoute) {
      return foundRoute.callback(req, res);
    }

    throw new ServerError(404, ServerErrorMessages.NOT_FOUND);
  };
  return {
    get,
    post,
    execRoute,
  };
};
