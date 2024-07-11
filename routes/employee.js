// routes/employee.js

import express from 'express';
import { empregister, emplogin, authmiddleware, getProfileById, addTimeRecord, getTimeRecords, uploadProfileImage } from '../controllers/employee.js';
import multer from 'multer';
import { Client, Work } from '../models/adminenq.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post("/empregister", empregister);
router.post("/emplogin", emplogin);
router.get("/profile", authmiddleware, getProfileById);
router.post("/timeRecord", authmiddleware, addTimeRecord);
router.get("/timeRecords", authmiddleware, getTimeRecords);
router.post("/uploadProfileImage", authmiddleware, upload.single('profileImage'), uploadProfileImage);


router.get('/client-statuses', async (req, res) => {
    try {
        const { department } = req.teamleader;
        const clients = await Client.find();
        const clientStatuses = clients.map(client => {
            return {
                clientName: client.clientName,
                status: client[`${department.toLowerCase()}Status`]
            };
        });
        res.json({ success: true, clientStatuses });
    } catch (error) {
        res.status(500).json({ message: `Failed to retrieve client statuses: ${error.message}` });
    }
});


export default router;
