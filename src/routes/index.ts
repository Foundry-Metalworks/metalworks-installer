import { onUpload } from '@/handlers/upload';
import { validateToken } from '@/middleware/auth';
import { body } from 'express-validator';
import validate from '@/middleware/validate';
import * as foundryHandlers from '@/handlers/foundry';
import express from 'express';

const router = express.Router();

router.post('/setup', body('url').isURL(), validate, onUpload);
router.post('/start', validateToken, foundryHandlers.startFoundry);
router.post('/stop', validateToken, foundryHandlers.stopFoundry);
router.post('/save', validateToken, foundryHandlers.saveFoundry);
router.post('/shutdown', validateToken, foundryHandlers.shutdownFoundry);
router.get('/status', validateToken, foundryHandlers.getFoundryStatus);

export default router;
