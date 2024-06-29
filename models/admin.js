// admin_model.js
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new Schema(
    {
        email : { type : String , unique : true , required : true },
        passwordhash : { type : String , required : true },
        approved: { type: Boolean, default: false },
    },
    {
        timestamps : true
    }
);

adminSchema.pre('save', async function (next) {
    const tl = this;
    if (!tl.isModified('passwordhash')) return next();
    try {
        if (tl.passwordhash) {
            const hash = await getHash(tl.passwordhash);
            tl.passwordhash = hash;
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

const Admin = model('Admin', adminSchema);
export default Admin;
export { getHash };