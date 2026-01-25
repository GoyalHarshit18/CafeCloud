import express from 'express';
import { getReportsByPeriod } from '../controllers/reports.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:period', protect, getReportsByPeriod);

export default router;
