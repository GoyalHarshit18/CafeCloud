import express from 'express';
import { getReportsByPeriod } from '../controllers/reports.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:period', protect, admin, getReportsByPeriod);

export default router;
