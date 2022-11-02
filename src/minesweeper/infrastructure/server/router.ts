import {
  exposeCellController,
  healthController,
  startGameController,
  flagsPostController,
  deleteFlagController,
} from '@minesweeper/infrastructure/controllers';
import { endpoints } from './constants';
import { Router } from './utils/routerHandler';

const router = Router();

/* add here your routes :D */
router.get('/health', healthController); //router example
router.post(endpoints.flags, flagsPostController);
router.get('/start', startGameController);
router.patch(endpoints.cells, exposeCellController);
router.get(endpoints.game, startGameController);
router.remove(endpoints.flags, deleteFlagController);

export default router;
