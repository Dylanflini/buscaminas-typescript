import router from './router';
import { RequestListener } from 'http';
import { ServerError } from './utils/validations';

export const requestHandler: RequestListener = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*'); //change for environment
    res.setHeader('Content-Type', 'application/json');
    await router.execRoute(req, res);
  } catch (error) {
    // error handling
    console.error(error);

    if (error instanceof ServerError) {
      const { code, message } = error;
      res.statusCode = code;
      res.write(JSON.stringify({ message })); //se puede mejorar
      return res.end();
    }

    res.statusCode = 500;
    res.end();
  }
};
