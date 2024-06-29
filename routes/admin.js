// Adminroute.js
import express from 'express';
import { adregister, adlogin, getEmployeeData, toggleEmployeeApproval} from '../controllers/admin.js';
import { Work, Client } from '../models/adminenq.js';
import { getPublicData ,authmiddleware } from '../controllers/admin.js';

const router = express.Router();

router.post("/adregister", adregister);
router.post("/adlogin", adlogin);
router.get("/public", authmiddleware, getPublicData);
router.get("/allemployee", authmiddleware, getEmployeeData);
router.patch('/employee/:id/toggleApproval', authmiddleware, toggleEmployeeApproval);




router.post('/clients', async (req, res) => {
    try {
        const { clientName } = req.body;
        const newClient = new Client({ clientName });
        await newClient.save();
        res.json({ success: true, message: 'Client added successfully', client: newClient });
    } catch (error) {
        res.status(500).json({ message: `Failed to add client: ${error.message}` });
    }
});

router.post('/works', async (req, res) => {
    try {
        const { workName, department } = req.body;
        const newWork = new Work({ workName, department });
        await newWork.save();
        res.json({ success: true, message: 'Work added successfully', work: newWork });
    } catch (error) {
        res.status(500).json({ message: `Failed to add work: ${error.message}` });
    }
});

router.get('/clients', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json({ success: true, clients });
    } catch (error) {
        res.status(500).json({ message: `Failed to retrieve clients: ${error.message}` });
    }
});

router.get('/works', async (req, res) => {
    try {
        const works = await Work.find();
        res.json({ success: true, works });
    } catch (error) {
        res.status(500).json({ message: `Failed to retrieve works: ${error.message}` });
    }
});
export default router;
