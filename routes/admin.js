// Adminroute.js
import express from 'express';
import { adregister, adlogin, getEmployeeData, toggleEmployeeApproval} from '../controllers/admin.js';
import {  getTeamLeaderData, toggleTeamLeaderApproval} from '../controllers/admin.js';
import { Work, Client } from '../models/adminenq.js';
import { getPublicData ,authmiddleware, updatePublicVerifiedStatus } from '../controllers/admin.js';
import Expense from '../models/expense.js';
import { initializeMonths, getMonths, updateMonth } from '../controllers/admin.js';


const router = express.Router();

router.post("/adregister", adregister);
router.post("/adlogin", adlogin);
router.get("/public", authmiddleware, getPublicData);
router.patch("/public/:id", authmiddleware, updatePublicVerifiedStatus);

router.get("/allemployee", authmiddleware, getEmployeeData);
router.get("/allteamleader", authmiddleware, getTeamLeaderData);
router.patch('/employee/:id/toggleApproval', authmiddleware, toggleEmployeeApproval);
router.patch('/teamleader/:id/toggleApproval', authmiddleware,toggleTeamLeaderApproval);


router.get('/months', getMonths);
router.patch('/months/:id', updateMonth);
router.post('/initialize-months', initializeMonths);

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


// Update client status route
router.patch('/clients/:id', async (req, res) => {
    console.log(`PATCH request received for client ID: ${req.params.id}`);
    console.log(`Request body:`, req.body);
    try {
        const { id } = req.params;
        const updateData = req.body;

        const client = await Client.findByIdAndUpdate(id, updateData, { new: true });
        if (!client) {
            console.log('Client not found');
            return res.status(404).json({ success: false, message: 'Client not found' });
        }

        res.json({ success: true, message: 'Client status updated successfully', client });
    } catch (error) {
        console.error('Error updating client status:', error);
        res.status(500).json({ success: false, message: `Failed to update client status: ${error.message}` });
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

// expense
router.post('/expense', async (req, res) => {
    try {
        const item = new Expense(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/expense', async (req, res) => {
    try {
        const items = await Expense.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/expense/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Expense.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
// calander
