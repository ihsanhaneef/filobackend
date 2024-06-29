// routes/employee.js

import express from 'express';
import { empregister, emplogin, authmiddleware, getProfileById, addTimeRecord, getTimeRecords } from '../controllers/employee.js';

const router = express.Router();

router.post("/empregister", empregister);
router.post("/emplogin", emplogin);
router.get("/profile", authmiddleware, getProfileById);
router.post("/timeRecord", authmiddleware, addTimeRecord);
router.get("/timeRecords", authmiddleware, getTimeRecords);

export default router;
