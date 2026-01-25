import express from 'express';
import { createBranch, getBranches } from '../controllers/branch.controller.js';

const router = express.Router();

router.post('/', createBranch);
router.get('/', getBranches);

export default router;
