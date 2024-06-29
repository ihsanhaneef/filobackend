// teamleader_router.js
import express from 'express';
import { tlregister, tllogin, } from '../controllers/teamleader.js';
const router = express.Router();
router.post("/tlregister", tlregister);
router.post("/tllogin", tllogin);


export default router;