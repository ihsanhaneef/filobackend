
// teamleader_router.js
import express from 'express';
import { tlregister, tllogin, createStatus, getStatus, updateWorkStatus, authmiddleware } from '../controllers/teamleader.js';
import { Client, Work, Status } from '../models/adminenq.js';
const router = express.Router();


// Example function to fetch clients with associated work details
async function fetchClientsWithWorkDetails() {
    try {
        const clients = await Client.find().populate('work');
        return clients;
    } catch (error) {
        console.error('Failed to fetch clients with work details:', error.message);
        throw error;
    }
}

router.post("/tlregister", tlregister);
router.post("/tllogin", tllogin);

router.use(authmiddleware); // Protecting routes below with authentication

router.get('/works', async (req, res) => {
    try {
        const works = await Work.find();
        res.json({ success: true, works });
    } catch (error) {
        res.status(500).json({ message: `Failed to retrieve works: ${error.message}` });
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

router.post('/status', createStatus);
router.get('/status', getStatus);
router.patch('/status/:id', updateWorkStatus);

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

router.get('/allclient', async (req, res) => {
    try {
        const clients = await Client.find();
        const clientStatuses = clients.map(client => {
            return {
                
                clientName: client.clientName,
                administrationStatus: client.administrationStatus,
                incometaxStatus: client.incometaxStatus,
                gstStatus: client.gstStatus,
                internalauditingStatus: client.internalauditingStatus,
                otherStatus: client.otherStatus,
            };
        });
        res.json({ success: true, clientStatuses });
    } catch (error) {
        res.status(500).json({ message: `Failed to retrieve client statuses: ${error.message}` });
    }
});

// import { Client, Status } from './models/adminenq.js';



router.get('/clients-all', async (req, res) => {
    try {
        const clients = await fetchClientsWithWorkDetails();
        res.json({ success: true, clients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
