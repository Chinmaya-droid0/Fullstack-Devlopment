 import User from "../models/user.model.js"
 import crypto from "crypto";
 import sendVerificationEmail from "../utils/sendMail.js";
 import jwt from 'jsonwebtoken';
 
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
            message: "Password is not valid",
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
        const tokenExpiry = Date.now()+ 10*60*1000;  // Expiry Time 10 mins

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
        console.error("REGISTER ERROR >>>", error); 
      return res.status(500).json({
        success:false,
        message:"Internal server Error"
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
                message: "please verify your email before logging in",
            });
        }

         // Check password
         const isPasswordMatch = await user.comparePassword(password);
         if(!isPasswordMatch){
               return res.status(401).json({
                success: false,
                message: "Password is not correct",
               });
         }

         // JWT Token
         const jwtToken = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
            expiresIn: "15m"
         })

          // Set Cookies
         const cookieOptions = {
            expires: new Date(Date.now() + 15* 60* 1000),
            httpOnly: true, // XSS attacks
         }

         res.cookie("jwtToken", jwtToken, cookieOptions)

         return res.status(200).json({
            success: true,
            message: "Login successfull"
         })


     } catch (error) {
         
        return res.status(500).json({
            success: true,
            message: "Internal server error",
        });
     }
   }

    const getProfile = async (req, res) => {
    try {
        console.log("getProfile hit");          
        console.log("req.user:", req.user);      
        const userId = req.user.id;
        console.log("userId:", userId);          

        const user = await User.findById(userId).select("-password")
        console.log("user:", user);               

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user
        })

    } catch (error) {
        console.error("GET PROFILE ERROR >>>", error);  // ✅ exact error
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


export {register, verify, login, getProfile };