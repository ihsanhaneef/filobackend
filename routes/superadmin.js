// routes/superadmin.js

import express from 'express';
import { getEmployeeData, getAvailableMonths } from '../controllers/superadmin.js';

const router = express.Router();

router.get('/employeeData', getEmployeeData);
router.get('/months', getAvailableMonths); // Add this route for fetching months

export default router;
