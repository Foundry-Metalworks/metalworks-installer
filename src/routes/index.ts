import express from 'express';
import fileUpload from 'express-fileupload';
import { onUpload } from '@/handlers/upload';
import foundryRouter from './foundry';
import dropletRouter from './droplet';
import { validateToken } from '@/middleware/auth';

const router = express.Router();

const upload = fileUpload();
router.post('/upload', upload, onUpload);
router.use('/foundry', validateToken, foundryRouter);
router.use('/droplet', validateToken, dropletRouter);

export default router;
