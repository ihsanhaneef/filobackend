
// teamleader_controller.js
import { JWT_SECRET } from "../constants/index.js";
import TeamLeader from '../models/teamleader.js';
import { comparePasswords, generateToken } from '../utils/helpers.js';
import jwt from 'jsonwebtoken';
import { Status, Work, Client } from '../models/adminenq.js';

// export async function tlregister(req, res) {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             throw new Error("Registration failed: All fields are required");
//         }
//         const teamleaderExist = await TeamLeader.findOne({ email });
//         if (teamleaderExist) {
//             throw new Error("Team Leader already Registered");
//         }
//         await TeamLeader.create({ email, passwordhash: password });
//         return res.json({ success: true });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: `Registration failed: ${error.message ?? error.response}` });
//     }
// }
export async function tlregister(req, res) {
    try {
        const { email, password, department } = req.body;
        if (!email || !password || !department) {
            throw new Error("Registration failed: All fields are required");
        }
        const teamleaderExist = await TeamLeader.findOne({ email });
        if (teamleaderExist) {
            throw new Error("Team Leader already Registered");
        }
        await TeamLeader.create({ email, passwordhash: password, department });
        return res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Registration failed: ${error.message ?? error.response}` });
    }
}

// export async function tllogin(req, res) {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             throw new Error("Email or password not found");
//         }
//         const teamleader = await TeamLeader.findOne({ email });
//         const correctPassword = await comparePasswords(password, teamleader.passwordhash);
//         if (!teamleader || !correctPassword) {
//             throw new Error("Invalid username or password");
//         }
//         if (!teamleader.approved) {
//             throw new Error("Account is not verified by admin");
//         }

//         const token = generateToken({ tlID: teamleader._id });
//         return res.status(200).json({ token });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: `Login failed: ${error.message ?? error.response}` });
//     }
// }


export async function tllogin(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Email or password not found");
        }
        const teamleader = await TeamLeader.findOne({ email });
        const correctPassword = await comparePasswords(password, teamleader.passwordhash);
        if (!teamleader || !correctPassword) {
            throw new Error("Invalid username or password");
        }
        if (!teamleader.approved) {
            throw new Error("Account is not verified by admin");
        }

        const token = generateToken({ tlID: teamleader._id, department: teamleader.department });
        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Login failed: ${error.message ?? error.response}` });
    }
}

export async function authmiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - no token provided" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded) {
            const teamleader = await TeamLeader.findById(decoded.tlID, { passwordhash: 0 });
            if (teamleader) {
                req.teamleader = teamleader;
                next();
                return;
            }
        }
        throw new Error();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
}

export async function createStatus(req, res) {
    try {
        const { client, work, workStatus } = req.body;
        const newStatus = new Status({ client, work, workStatus });
        await newStatus.save();
        res.json({ success: true, message: 'Status submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: `Failed to create status: ${error.message}` });
    }
}

export async function getStatus(req, res) {
    try {
        const statuses = await Status.find().populate('client').populate('work');
        res.json({ success: true, statuses });
    } catch (error) {
        res.status(500).json({ message: `Failed to retrieve statuses: ${error.message}` });
    }
}

export async function updateWorkStatus(req, res) {
    try {
        const { id } = req.params;
        const { workStatus } = req.body;
        const updatedStatus = await Status.findByIdAndUpdate(id, { workStatus }, { new: true });
        if (!updatedStatus) {
            return res.status(404).json({ message: 'Status not found' });
        }
        res.json({ success: true, message: 'Work status updated successfully', status: updatedStatus });
    } catch (error) {
        res.status(500).json({ message: `Failed to update work status: ${error.message}` });
    }
}
