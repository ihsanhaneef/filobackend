// public_controller.js 
import Public from '../models/public.js';


export async function publicregister (req,res){
    try{
        const { businessname , email , place , contactnumber , name , designation , message } = req.body;
        if ( !businessname || !email || !place || !contactnumber || !name || !designation || !message ) {
            throw new Error (" All fields are require ");
        }

        const savedData = await Public.create(req.body);
        if (!savedData) return res.status(400).json({ message: "Registration is failed due to server error." })
            res.status(200).json({ message: "You are successfully registered." });

    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: `Registration failed: ${error.message}` });
    }
}



