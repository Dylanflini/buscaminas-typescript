import {
  patchCellController,
  healthController,
  startGameController,
} from '@minesweeper/infrastructure/controllers';
import { Router } from './utils/routerHandler';

const router = Router();

/* add here your routes :D */
router.get('/health', healthController); //router example
router.get('/start', startGameController);
router.patch('/cells', patchCellController);

export default router;
