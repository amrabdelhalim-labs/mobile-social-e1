import express from 'express';
import * as controller from '../controllers/user.controller.js';
import * as validator from '../validators/user.validator.js';
import { validateRequest } from '../middlewares/validator.middleware.js';

const router = express.Router();

router.post('/register',
  validator.register,
  validateRequest,
  controller.register
);

router.post('/login',
  validator.login,
  validateRequest,
  controller.login
);


export default router;