// index.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import url from 'url';
import { initializeMonths } from './controllers/admin.js'; // Ensure correct import
import multer from 'multer';

import empRouter from './routes/employee.js';
import tlRouter from './routes/teamleader.js';
import pubRouter from './routes/public.js';
import sAdminRouter  from './routes/superadmin.js';
import adminRoutes from './routes/admin.js';
dotenv.config();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const connectDB = async () => {
    try {
        const ConnectionURL = process.env.DB_URL;
        console.log("Database connecting.......");
        const conn = await mongoose.connect(ConnectionURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
       
     console.log(`MongoDB connected: ${conn.connection.host}`);
     await initializeMonths();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};



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



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
// Use routers from the project
app.use("/api/employee", empRouter);
app.use("/api/teamleader", tlRouter);
app.use("/api/public", pubRouter);
app.use("/api/sAdmin", sAdminRouter );
app.use('/api/admin', adminRoutes);


const PORT = 7000;
connectDB();
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
