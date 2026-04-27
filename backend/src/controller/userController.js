import User from "../models/userModel.js"
export const users = async (req, res)=> {
    try {
        const loggedInUserId = req.user.userId;
        const Users = await User.find({_id: {$ne: loggedInUserId}});
        return res.json(Users)
    } catch (error) {
        return res.json({success: false, error: "Failed to fetch users"})
    }
}

export const getSelectedUser = async (req, res)=>{
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        return res.json({
            fullName: user.fullName,
            userName: user.userName,
            _id: user._id,
        });
    } catch (error) {
        return res.json({success: false, error: "Failed to get selected user's details"})
    }
}