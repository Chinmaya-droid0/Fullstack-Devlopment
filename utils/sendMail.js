import nodemailer from 'nodemailer';

//Create Transport
const sendVerificationEmail = async(email,token) =>{
    try{
       //transporter
       const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, 
        port: process.env.EMAIL_PORT,
        secure:false,
        auth: {
            user: process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        },
       });

     // verification URL
     const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${token}`;
    }
  
    

catch(error){
    console.error('Error sending verification email:', error);
}
};
 
//MailOptions
//Send MAil