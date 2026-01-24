import express from 'express';
import { getBranches, createBranch } from '../controllers/branch.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getBranches)
    .post(protect, admin, createBranch);

export default router;
