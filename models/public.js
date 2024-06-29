// public_model.js 
import { Schema, model } from "mongoose";

const publicSchema = new Schema(
    {
        businessname : { type : String , required : true },
        email : { type :String , required : true },
        place : { type : String , required : true },
        contactnumber : {type : String , required : true },
        name : { type : String , required : true },
        designation : { type : String , required : true },
        message : { type : String , required : true },
        verified : { type: Boolean, default: false }
    },
    
    { timestamps : true }
);

const Public = model('Public', publicSchema);
export default Public;