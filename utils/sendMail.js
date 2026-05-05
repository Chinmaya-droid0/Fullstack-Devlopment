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
    
  
     // Email Content
     const mailOptions = {
        from: `"Autehntication App"<${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "Please verify your email address",
        text:`
        Thank you for registering! Please verify your email address to complete 
        your registretion.
        ${verificationUrl}
        This verification link will expire 10 mins.
        If you did not create an account, please ignore this email.`,
     };

     //Send MAil
     const info = await transporter.sendMail(mailOptions);
     console.log("Verification email sent: %s ", info.messageId);
     return true;
    }

catch(error){
    console.error('Error sending verification email:', error);
}
};
 
export default sendVerificationEmail