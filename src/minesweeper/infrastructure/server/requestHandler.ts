import router from './router';
import { RequestListener } from 'http';
import { ServerError } from './utils/validations';

export const requestHandler: RequestListener = async (request, response) => {
  try {
    response.setHeader('Access-Control-Allow-Origin', '*'); //change for environment
    response.setHeader('Content-Type', 'application/json');
    await router.execRoute(request, response);
  } catch (error) {
    // error handling
    console.error(error);

    if (error instanceof ServerError) {
      const { code, message } = error;
      response.statusCode = code;
      response.write(JSON.stringify({ message })); //se puede mejorar
      return response.end();
    }

    response.statusCode = 500;
    response.end();
  }
};
