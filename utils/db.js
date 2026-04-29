import mongoose from'mongoose';
import dotenv from'dotenv';

dotenv.config();

const db = ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("BADHAII HOO DB Connected Successfully");
        
    })
    .catch((error)=>{
          console.log("Error in DB Connection:", error);
          
    }
    )
}


export default db;