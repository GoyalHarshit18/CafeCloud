import express from 'express';
import { getFloors, getTablesByFloor, updateTableStatus } from '../controllers/pos.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Floor routes
router.get('/floors', protect, getFloors);

// Table routes
router.get('/floors/:floorId/tables', protect, getTablesByFloor);
router.patch('/tables/:tableId', protect, updateTableStatus);

export default router;
