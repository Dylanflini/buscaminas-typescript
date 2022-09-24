import { exposeCellController, healthController, startGameController } from '../controllers';
import { Router } from './utils/routerHandler';

const router = Router();

/* add here your routes :D */
router.get('/health', healthController); //router example
router.get('/start', startGameController);
router.get('/expose', exposeCellController);

export default router;
