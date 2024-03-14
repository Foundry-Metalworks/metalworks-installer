import express from 'express';
import { onUpload } from '@/handlers/upload';
import foundryRouter from './foundry';
import dropletRouter from './droplet';
import { validateToken } from '@/middleware/auth';
import { body } from 'express-validator';
import validate from '@/middleware/validate';

const router = express.Router();

router.post('/upload', body('url').isURL(), validate, onUpload);
router.use('/foundry', validateToken, foundryRouter);
router.use('/droplet', validateToken, dropletRouter);

export default router;
