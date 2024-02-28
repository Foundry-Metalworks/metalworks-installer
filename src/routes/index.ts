import express from 'express';
import fileUpload from 'express-fileupload';
import { onUpload } from '@/handlers/upload';
import foundryRouter from './foundry';
import dropletRouter from './droplet';

const router = express.Router();

const upload = fileUpload();
router.post('/upload', upload, onUpload);
router.use('/foundry', foundryRouter);
router.use('/droplet', dropletRouter);

export default router;
