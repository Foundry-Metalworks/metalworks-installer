import express from 'express';
import * as dropletHandlers from '@/handlers/droplet';

const router = express.Router();

router.post('/stop', dropletHandlers.stopDroplet);
router.post('/save', dropletHandlers.saveDroplet);

export default router;
