// models/timeRecord.js

import { Schema, model } from 'mongoose';

const timeRecordSchema = new Schema(
    {
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        company: { type: String, required: true },
        work: { type: String, required: true },
        duration: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

const TimeRecord = model('TimeRecord', timeRecordSchema);

export default TimeRecord;
