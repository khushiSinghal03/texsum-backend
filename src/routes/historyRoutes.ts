import { Router } from 'express';
import { getUserHistory } from '../controllers/historyController';

const router = Router();

router.get('/:userId', getUserHistory);

export default router;