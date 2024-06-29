// public-router.js
import express from 'express';
import { publicregister} from '../controllers/public.js';
import {authmiddleware} from '../controllers/admin.js';

const router = express.Router();
router.post("/publicregister",publicregister,authmiddleware);

export default router;