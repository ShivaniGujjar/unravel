import { Router } from 'express';
import { getMe, login, register, verifyEmail } from '../controllers/auth.controller.js';
import { loginValidation, registerValidation } from '../validation/auth.validator.js';

import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerValidation, register);

router.get('/verify-email', verifyEmail);

router.post('/login',loginValidation,login )

router.get('/get-me', protect, getMe)

export default router;