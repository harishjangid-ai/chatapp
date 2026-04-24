import User from "../models/userModel.js";
import bcrypt from "bcrypt"

export const signUp = async(req, res)=>{
    try {
        const {userName, password, fullName} = req.body;
        if(!userName || !password || !fullName){
            return res.json({success: false, error: "All fields are required"})
        }
        const userNameExist = await User.findOne({ userName });
        if(userNameExist){
            return res.json({success: false, error: "User Name already exist"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            userName,
            password: hashedPassword,
        })

        return res.status(200).json({success: true, message: "Sign up completed"});
    } catch (error) {
        return res.status(500).json({success: false, error: "Sign up failed"})
    }
}