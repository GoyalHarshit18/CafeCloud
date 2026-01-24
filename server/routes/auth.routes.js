import express from 'express';
import {
    signupRequest,
    loginRequest,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signupRequest);
router.post('/login', loginRequest);

export default router;
