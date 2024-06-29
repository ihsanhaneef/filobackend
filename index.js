// index.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import empRouter from './routes/employee.js';
import tlRouter from './routes/teamleader.js';
import pubRouter from './routes/public.js';
// import adRouter from './routes/admin.js'; // Ensure the correct router file is imported
import adminRoutes from './routes/admin.js';
dotenv.config();

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
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

app.use(bodyParser.json());
app.use(cors());

// Use routers from the project
app.use("/api/employee", empRouter);
app.use("/api/teamleader", tlRouter);
app.use("/api/public", pubRouter);
// app.use("/api/admin", adRouter); // Ensure the router is used correctly
app.use('/api/admin', adminRoutes);


const PORT = 7000;
connectDB();
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
