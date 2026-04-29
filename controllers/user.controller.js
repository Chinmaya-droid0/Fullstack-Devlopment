 import User from "../models/user.model.js"
 import crypto from "crypto";
 
 const register = async (req , res) =>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({
            success: false ,
            message: "All fields are Required"
        })
    }

    if(password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password is not valid"
        })
    }

    try {
        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date.now()+ 10*60*60*1000;

        

    }
    catch(error){

    }


};

export {register};