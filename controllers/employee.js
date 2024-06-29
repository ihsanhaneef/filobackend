// // employee_controller.js 
// import { JWT_SECRET } from '../constants/index.js';
// import Employee from '../models/employee.js';
// import { comparePasswords, generateToken } from '../utils/helpers.js';
// import jwt from 'jsonwebtoken';
// import TimeRecord from '../models/timeRecord.js';



// export async function empregister(req, res) {
//     try {
//         const { email, password, fullname, phonenumber, address , gender } = req.body;
//         if (!email || !password || !fullname || !phonenumber || !address || !gender) {
//             throw new Error("All fields are required");
//         }
//         const employeeExist = await Employee.findOne({ email });
//         if (employeeExist) {
//             throw new Error("Employee already registered");
//         }
//         await Employee.create({ email, passwordhash: password, fullname, phonenumber, address, gender });
//         return res.json({ success: true });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: `Registration failed: ${error.message}` });
//     }
// }

// export async function emplogin(req, res) {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password ) {
//             throw new Error("email or password not  or employee not found");
//         }
//         const employee = await Employee.findOne({ email });
//         const correctPassword = await comparePasswords(password, employee.passwordhash);
//         if (!employee || !correctPassword ) {
//             throw new Error("Invalid user name or password");
//         }
//         if ( !employee.approved ){
//             throw new Error("Account is not verified by admin");
//         }
//         const token = generateToken({ empId: employee._id });
//         return res.status(200).json({ token });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: `login failed due to: ${error.message ?? error.response}` });
//     }
// }

// export async function authmiddleware(req, res, next) {
//     const token = req.headers.authorization;
//     if (!token) {
//         return res.status(401).json({ message: "unauthorized - no token provided" });
//     }
//     try {
//         const decoded = jwt.verify(token, JWT_SECRET);
//         if (decoded) {
//             const employee = await Employee.findById(decoded.empId, { passwordhash: 0 });
//             if (employee) {
//                 req.employee = employee;
//                 next();
//                 return;
//             }
//         }
//         throw new Error();
//     } catch (error) {
//         return res.status(401).json({ message: "Unauthorized - Invalid token" });
//     }
// }


// export async function getProfileById(req, res) {
//     try {
//         const employeeId = req.employee;
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

// // Add new time record
// export async function addTimeRecord(req, res) {
//     try {
//         // Extract required fields from request body
//         const { date, startTime, endTime, company, work, duration } = req.body;

//         // Create new time record
//         const newTimeRecord = await TimeRecord.create({ date, startTime, endTime, company, work, duration });

//         // Respond with success message
//         res.status(201).json({ success: true, message: "Time record added successfully" });
//     } catch (error) {
//         console.error("Failed to save time record:", error);
//         res.status(500).json({ message: `Failed to save time record: ${error.message}` });
//     }
// }

// // Get all time records
// export async function getTimeRecords(req, res) {
//     try {
//         // Fetch all time records
//         const timeRecords = await TimeRecord.find({});

//         // Respond with time records
//         res.status(200).json(timeRecords);
//     } catch (error) {
//         console.error("Failed to fetch time records:", error);
//         res.status(500).json({ message: `Failed to fetch time records: ${error.message}` });
//     }
// }



// controllers/employee.js

import { JWT_SECRET } from '../constants/index.js';
import Employee from '../models/employee.js';
import { comparePasswords, generateToken } from '../utils/helpers.js';
import jwt from 'jsonwebtoken';

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

export async function getProfileById(req, res) {
    try {
        const employeeId = req.employee._id;
        const employee = await Employee.findById(employeeId).select('-passwordhash');
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json(employee);
    } catch (error) {
        console.error("Error fetching employee profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Add new time record
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
