import express from 'express';
import userRouter from './user.routes.js';
import postRouter from './post.routes.js';

const router = express.Router();

router.use('/account', userRouter);
router.use('/posts', postRouter);

export default router;