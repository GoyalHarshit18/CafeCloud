import express from 'express';
import {
    signupRequest,
    verifySignup,
    loginRequest,
    verifyLogin,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signupRequest);
router.post('/verify-signup', verifySignup);
router.post('/login', loginRequest);
router.post('/verify-login', verifyLogin);

export default router;
