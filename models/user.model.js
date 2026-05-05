import mongoose from "mongoose";
import bcrypt from "bcryptjs";

   const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    }, 
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    role: {
        type:String,
        enum: ["user", "admin"],
        default: "user", 
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
   },
   {
    timestamps: true,
   }
);

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = bcrypt.hash(this.password, 10)
        next();
    }
})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema);

export default User;