import { Router } from 'express';
import { userRouter } from './userRoutes';
import { thoughtRouter } from './thoughtRoutes';

const router = Router();

router.use('/users', userRouter);
router.use('/thoughts', thoughtRouter);

export default router;
