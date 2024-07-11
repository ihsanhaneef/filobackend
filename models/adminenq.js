
// models/adminenq.js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const workSchema = new Schema({
    workName: String,
    department: String,
    workStatus: { type: Boolean, default: false },
});

const clientSchema = new Schema({
    clientName: String,
    administrationStatus: { type: Boolean, default: false },
    incometaxStatus: { type: Boolean, default: false },
    gstStatus: { type: Boolean, default: false },
    internalauditingStatus: { type: Boolean, default: false },
    otherStatus: { type: Boolean, default: false },
});

const statusSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    work: { type: Schema.Types.ObjectId, ref: 'Work' },
    workStatus: { type: Boolean, default: false },
});

const Work = mongoose.model('Work', workSchema);
const Client = mongoose.model('Client', clientSchema);
const Status = mongoose.model('Status', statusSchema);

export { Work, Client, Status };
