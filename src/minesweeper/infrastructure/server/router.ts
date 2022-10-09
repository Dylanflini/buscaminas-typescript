import {
  exposeCellController,
  healthController,
  startGameController,
  flagsPostController,
} from '@minesweeper/infrastructure/controllers';
import { endpoints } from './constants';
import { Router } from './utils/routerHandler';

const router = Router();

/* add here your routes :D */
router.get('/health', healthController); //router example
router.post(endpoints.flags, flagsPostController);
router.get(endpoints.game, startGameController);
router.get('/expose', exposeCellController);

export default router;
