import router from './router';
import { RequestListener } from 'http';
import { ServerError } from './utils/validations';

export const requestHandler: RequestListener = async (req, res) => {
  try {
    res.setHeader('content-type', 'application/json');
    await router.execRoute(req, res);
  } catch (error) {
    // error handling
    console.error(error);

    if (error instanceof ServerError) {
      res.statusCode = error.code;
      res.write(JSON.stringify({ message: error.message })); //To Do, error handling
      return res.end();
    }

    res.statusCode = 500;
    res.end();
  }
};
