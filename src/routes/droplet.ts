import express from 'express';
import { saveDroplet, stopDroplet } from '@/handlers/droplet';

const router = express.Router();

router.post('/stop', stopDroplet);
router.post('/save', saveDroplet);

export default router;
