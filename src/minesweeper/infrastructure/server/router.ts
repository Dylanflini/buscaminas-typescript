import { healthController } from '../controllers';
import { Router } from './utils/routerHandler';

const router = Router();

/* add here your routes :D */
router.get('/health', healthController); //router example

export default router;
