 import User from "../models/user.model.js"
 import crypto from "crypto";
 import sendVerificationEmail from "../utils/sendMail.js";
 
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
        const tokenExpiry = new Date.now()+ 10*60*60*1000;  // Expiry Time 10 mins

        // Create a user database
       const user = await User.create({
            name,
            email,
            password,
            verificationToken: token,
            verificationTokenExpiry: tokenExpiry,
       })

       if(!user) {
        return res.status(400).json({
            success: false,
            message: 'User not Created'
        });
       }
     
       // SendMail    
       await sendVerificationEmail(user.email, token);

       // response to user
       return res.status(200).json({
        success: true,
        message:"User Registered successfully , Now you have to verify your Email"
       })
    }
    catch(error){
      return res.status(500).json({
        success:true,
        messsage:"Internal server Error"
      });
    }
}; 

// Verify Cotnroller
const verify = async (req, res) =>{
    try {
          // get token from Params
          const token = req.params.token

          //Get User
          const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: {$gt: Date.now()}
          })

          // is user exist
          if(!user){
            return res.status(200).json({
                success: false,
                message: "Invalid Token"
            })
          }

          user.isVerified = true;
          user.verificationToken  = undefined;
          user.verificationTokenExpiry = undefined;

          await user.save();

          return res.status(200).json({
            success: true,
            message: "User account is verified",
          });
        
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: "Internal server error",
         });
    }
};

// login Controller
   const login = async (req, res) =>{
     // Get user data
     const {email, password} = req.body;

     // validate
     if(!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
     }

     try {
         const user = await User.findOne({email});
           if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
           }

           // Check if user verified
            if(!user.isVerified){
                return res.status(400).json({
                success:false,
                message: "User not found",
            });
        }

         // Check password
         const isPasswordMatch = await user.comparePassword(password);

     } catch (error) {
        
     }
   }


export {register, verify };