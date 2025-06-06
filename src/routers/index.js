import authRouter from './auth.js';
import contactsRouter from './contacts.js';
import { Router } from 'express';

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;
