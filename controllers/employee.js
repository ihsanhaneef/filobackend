
// controllers/employee.js

import { JWT_SECRET } from '../constants/index.js';
import Employee from '../models/employee.js';
import { comparePasswords, generateToken } from '../utils/helpers.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';



// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            console.log(`Creating upload directory at ${uploadDir}`);
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export async function empregister(req, res) {
    try {
        const { email, password, fullname, phonenumber, address, gender } = req.body;
        if (!email || !password || !fullname || !phonenumber || !address || !gender) {
            throw new Error("All fields are required");
        }
        const employeeExist = await Employee.findOne({ email });
        if (employeeExist) {
            throw new Error("Employee already registered");
        }
        await Employee.create({ email, passwordhash: password, fullname, phonenumber, address, gender });
        return res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Registration failed: ${error.message}` });
    }
}

export async function emplogin(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Email or password not provided");
        }
        const employee = await Employee.findOne({ email });
        const correctPassword = await comparePasswords(password, employee.passwordhash);
        if (!employee || !correctPassword) {
            throw new Error("Invalid user name or password");
        }
        if (!employee.approved) {
            throw new Error("Account is not verified by admin");
        }
        const token = generateToken({ empId: employee._id });
        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Login failed due to: ${error.message ?? error.response}` });
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
            const employee = await Employee.findById(decoded.empId, { passwordhash: 0 });
            if (employee) {
                req.employee = employee;
                next();
                return;
            }
        }
        throw new Error();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
}

// export async function getProfileById(req, res) {
//     try {
//         const employeeId = req.employee._id;
//         const employee = await Employee.findById(employeeId).select('-passwordhash');
//         if (!employee) {
//             return res.status(404).json({ message: "Employee not found" });
//         }
//         res.status(200).json(employee);
//     } catch (error) {
//         console.error("Error fetching employee profile:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// }

// export async function uploadProfileImage(req, res) {
//     try {
//         const employeeId = req.employee._id;
//         const profileImage = req.file.path;

//         const employee = await Employee.findByIdAndUpdate(employeeId, { profileImage }, { new: true });
//         if (!employee) {
//             return res.status(404).json({ message: "Employee not found" });
//         }

//         res.status(200).json({ success: true, profileImage: employee.profileImage });
//     } catch (error) {
//         console.error("Error uploading profile image:", error);
//         res.status(500).json({ message: `Failed to upload profile image: ${error.message}` });
//     }
// }

// Add new time record

export async function getProfileById(req, res) {
    try {
        const employeeId = req.employee._id;
        const employee = await Employee.findById(employeeId).select('-passwordhash');
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Include the full URL for the profile image
        const profileImageUrl = `http://localhost:7000/uploads/${employee.profileImage}`;
        res.status(200).json({ ...employee.toObject(), profileImageUrl });
    } catch (error) {
        console.error("Error fetching employee profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function addTimeRecord(req, res) {
    try {
        const employeeId = req.employee._id;
        const { date, startTime, endTime, company, work, duration } = req.body;

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        employee.timeRecords.push({ date, startTime, endTime, company, work, duration });
        await employee.save();

        res.status(201).json({ success: true, message: "Time record added successfully" });
    } catch (error) {
        console.error("Failed to save time record:", error);
        res.status(500).json({ message: `Failed to save time record: ${error.message}` });
    }
}

// Get all time records
export async function getTimeRecords(req, res) {
    try {
        const employeeId = req.employee._id;

        const employee = await Employee.findById(employeeId).select('timeRecords');
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(employee.timeRecords);
    } catch (error) {
        console.error("Failed to fetch time records:", error);
        res.status(500).json({ message: `Failed to fetch time records: ${error.message}` });
    }
}


// ES modules do not have __dirname, we use this workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function uploadProfileImage(req, res) {
    try {
        const employeeId = req.employee._id;
        const profileImage = req.file.filename; // Use the filename instead of the full path

        // Log the received file and employeeId for debugging
        console.log('Received file:', req.file);
        console.log('Employee ID:', employeeId);

        // Ensure the directory exists
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            console.log(`Creating upload directory at ${uploadDir}`);
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const employee = await Employee.findByIdAndUpdate(employeeId, { profileImage }, { new: true });
        if (!employee) {
            console.log('Employee not found');
            return res.status(404).json({ message: "Employee not found" });
        }

        console.log('Profile image updated successfully:', employee.profileImage);
        res.status(200).json({ success: true, profileImage: employee.profileImage });
    } catch (error) {
        console.error("Error uploading profile image:", error.stack);
        res.status(500).json({ message: `Failed to upload profile image: ${error.message}` });
    }
}