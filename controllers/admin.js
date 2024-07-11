
// Controller/admin.js 
import { JWT_SECRET } from "../constants/index.js";
import Admin from '../models/admin.js';
import Public from "../models/public.js";
import Employee from "../models/employee.js";
import TeamLeader from "../models/teamleader.js";
import Month from "../models/calander.js";
import { comparePasswords, generateToken } from '../utils/helpers.js';
import jwt from 'jsonwebtoken';

// Register admin route handlers
export async function adregister(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Registration failed: All fields are required");
        }
        const adminExist = await Admin.findOne({ email });
        if (adminExist) {
            throw new Error("Admin already Registered")
        }
        await Admin.create({ email, passwordhash: password });
        return res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Registration failed: ${error.message ?? error.response}` });
    }
}

// Login admin route handler
export async function adlogin(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("email or password not found");
        }
        const admin = await Admin.findOne({ email });
        const correctPassword = await comparePasswords(password, admin.passwordhash);
        if (!admin || !correctPassword) {
            throw new Error("Invalid user name or password");
        }
        if (!admin.approved) {
            throw new Error("Account is not verified by admin");
        }

        const token = generateToken({ adID: admin._id });
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
            const admin = await Admin.findById(decoded.adID);
            if (admin) {
                req.admin = admin;
                next();
            } else {
                throw new Error("Unauthorized - admin not found");
            }
        } else {
            throw new Error("Unauthorized - Invalid token");
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: error.message });
    }
}
// Fetch public data route handler
export async function getPublicData(req, res) {
    try {
        const publicData = await Public.find();
        res.json({ success: true, publicData });
    } catch (error) {
        console.error("Error fetching public data:", error);
        res.status(500).json({ success: false, message: `Failed to fetch public data: ${error.message}` });
    }
}

// Update verified status route handler
export async function updatePublicVerifiedStatus(req, res) {
    const { id } = req.params;
    const { verified } = req.body;

    try {
        const updatedPublic = await Public.findByIdAndUpdate(id, { verified }, { new: true });
        if (!updatedPublic) {
            return res.status(404).json({ success: false, message: 'Public data not found' });
        }
        res.json({ success: true, updatedPublic });
    } catch (error) {
        console.error("Error updating public data:", error);
        res.status(500).json({ success: false, message: `Failed to update public data: ${error.message}` });
    }
}








// Fetch all employee data route handler
export async function getEmployeeData(req, res) {
    try {
        const employeeData = await Employee.find();
        res.json({ success: true, employeeData });
    } catch (error) {
        console.error("Error fetching employee data:", error);
        res.status(500).json({ success: false, message: `Failed to fetch employee data: ${error.message}` });
    }
}

export async function toggleEmployeeApproval(req, res) {
    const { id } = req.params;
    const { approved } = req.body;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: `Employee not found with id ${id}` });
        }

        employee.approved = approved;
        await employee.save();

        return res.json({ success: true, message: `Employee approval status updated successfully` });
    } catch (error) {
        console.error("Error updating employee approval status:", error);
        return res.status(500).json({ success: false, message: `Failed to update employee approval status: ${error.message}` });
    }
}

/// Fetch all teamleader data route handler
export async function getTeamLeaderData(req, res) {
    try {
        const teamleaderData = await TeamLeader.find();
        res.json({ success: true, teamleaderData });
    } catch (error) {
        console.error("Error fetching teamleader data:", error);
        res.status(500).json({ success: false, message: `Failed to fetch teamleader data: ${error.message}` });
    }
}
export async function toggleTeamLeaderApproval(req, res) {
    const { id } = req.params;
    const { approved } = req.body;

    try {
        const teamleader = await Employee.findById(id);
        if (!teamleader) {
            return res.status(404).json({ success: false, message: `teamleader not found with id ${id}` });
        }

        teamleader.approved = approved;
        await teamleader.save();

        return res.json({ success: true, message: `TeamLeader approval status updated successfully` });
    } catch (error) {
        console.error("Error updating Teamleader approval status:", error);
        return res.status(500).json({ success: false, message: `Failed to update teamleader approval status: ${error.message}` });
    }
}



export async function initializeMonths(req, res) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    try {
        for (const monthName of monthNames) {
            const monthExists = await Month.findOne({ month: monthName });
            if (!monthExists) {
                const newMonth = new Month({ month: monthName });
                await newMonth.save();
            }
        }
        console.log("Months initialized successfully.");
        if (res) {
            res.status(200).json({ message: 'Months initialized successfully.' });
        }
    } catch (error) {
        console.error("Error initializing months:", error);
        if (res) {
            res.status(500).json({ message: 'Failed to initialize months.' });
        }
    }
}

export async function getMonths(req, res) {
    try {
        console.log("Fetching months...");
        const months = await Month.find();
        console.log("Months fetched:", months);
        res.json(months);
    } catch (error) {
        console.error("Error fetching months:", error);
        res.status(500).json({ error: error.message });
    }
}

export async function updateMonth(req, res) {
    const { id } = req.params;
    const { workingDays } = req.body;
    try {
        const month = await Month.findByIdAndUpdate(id, { workingDays }, { new: true });
        res.json(month);
    } catch (error) {
        console.error("Error updating month:", error);
        res.status(500).json({ error: error.message });
    }
}