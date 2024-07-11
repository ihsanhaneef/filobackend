// models/employee.js

import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import timeRecordSchema from './timeRecord.js'; // Make sure to include .js extension

const employeeSchema = new Schema(
    {
        email: { type: String, unique: true, required: true },
        passwordhash: { type: String, required: true },
        approved: { type: Boolean, default: false },
        fullname: { type: String, required: true },
        address: { type: String, required: true },
        phonenumber: { type: String, required: true },
        gender: { type: String, required: true },
        profileImage: { type: String }, // Add this line
        timeRecords: [timeRecordSchema] // Array of time records
    },
    {
        timestamps: true
    }
);

employeeSchema.pre('save', async function (next) {
    const employee = this;
    if (!employee.isModified('passwordhash')) return next();
    try {
        if (employee.passwordhash) {
            const hash = await getHash(employee.passwordhash);
            employee.passwordhash = hash;
        }
        next();
    } catch (error) {
        return next(error);
    }
});

async function getHash(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const Employee = model('Employee', employeeSchema);
export default Employee;
export { getHash };
