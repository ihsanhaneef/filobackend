// models/calander.js
import mongoose from 'mongoose';

const monthSchema = new mongoose.Schema({
    month: { type: String, required: true },
    workingDays: { type: Number, default: 0 },
}, { timestamps: true });

const Month = mongoose.model('Month', monthSchema);

export default Month;
