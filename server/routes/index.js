import express from 'express';
import userRouter from './user.routes.js';

const router = express.Router();

router.use('/account', userRouter);

export default router;