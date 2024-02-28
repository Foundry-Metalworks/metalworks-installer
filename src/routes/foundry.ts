import express from 'express';
import { getFoundryStatus, startFoundry, stopFoundry } from '@/handlers/foundry';

const router = express.Router();

router.get('/status', getFoundryStatus);
router.post('/start', startFoundry);
router.post('/stop', stopFoundry);

export default router;
