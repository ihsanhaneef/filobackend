// Admin_controller.js 
import { JWT_SECRET } from "../constants/index.js";
import Admin from '../models/admin.js';
import Public from "../models/public.js";
import Employee from "../models/employee.js";
import { comparePasswords, generateToken } from '../utils/helpers.js';
import jwt from 'jsonwebtoken';

export async function adregister(req , res){
    try{
        const { email , password } =req.body;
        if( !email || !password ){
            throw new Error("Registration failed: All fields are required");
        }
        const adminExist = await Admin.findOne({ email });
        if( adminExist){
            throw new Error ("Admin already Registered")
        }
        await Admin.create({ email, passwordhash: password });
        return res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Registration failed: ${error.message ?? error.response}` });
    }
}

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
            const admin = await Admin.findById(decoded.adID, { passwordhash: 0 });
            if (admin) {
                req.admin = admin;
                next();
                return;
            }
        }
        throw new Error();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
}


export async function getPublicData(req, res) {
    try {
        const publicData = await Public.find();
        res.json({ success: true, publicData });
    } catch (error) {
        console.error("Error fetching public data:", error);
        res.status(500).json({ success: false, message: `Failed to fetch public data: ${error.message}` });
    }
}

export async function getEmployeeData(req, res) {
    try {
        const publicData = await Public.find();
        res.json({ success: true, publicData });
    } catch (error) {
        console.error("Error fetching public data:", error);
        res.status(500).json({ success: false, message: `Failed to fetch public data: ${error.message}` });
    }
}





