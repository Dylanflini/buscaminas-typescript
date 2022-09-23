import router from './router';
import { RequestListener } from 'http';

export const requestHandler: RequestListener = async (req, res) => {
  try {
    await router.execRoute(req, res);
  } catch (error) {
    // error handling
    console.error(error);
    res.statusCode = 500;
    res.end();
  }
};
