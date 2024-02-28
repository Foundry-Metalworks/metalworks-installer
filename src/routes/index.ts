import express from 'express';
import fileUpload from 'express-fileupload';
import { onUpload } from '@/handlers/upload';
import foundryRouter from './foundry';
import dropletRouter from './droplet';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { requireInServer } from '@/middleware/auth';

const router = express.Router();

const upload = fileUpload();
router.post('/upload', upload, onUpload);

router.use('/foundry', ClerkExpressRequireAuth(), requireInServer, foundryRouter);
router.use('/droplet', ClerkExpressRequireAuth(), requireInServer, dropletRouter);

export default router;
