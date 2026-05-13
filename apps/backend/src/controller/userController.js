import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

export const users = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const chat = await Chat.find({ participants: loggedInUserId }).sort({
      lastMessageTime: -1,
    });
    const otherUsersId = chat.map((t) => {
      const otherUserId = t.participants.find(
        (p) => p.toString() !== loggedInUserId,
      );
      return otherUserId ? otherUserId.toString() : null;
    });

    const users = await User.find({
      _id: { $nin: [loggedInUserId, ...otherUsersId] },
    }).select("-password");

    const finalUsers = await User.find({ _id: { $in: otherUsersId } }).select(
      "-password",
    );
    const orderedUsers = otherUsersId.map((id) => {
      return finalUsers.find((user) => user._id.toString() === id);
    });
    const allUsers = [...orderedUsers, ...users];
    return res.json(allUsers);
  } catch (error) {
    return res.json({ success: false, error: "Failed to fetch users" });
  }
};

export const getSelectedUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    return res.json({
      fullName: user.fullName,
      userName: user.userName,
      _id: user._id
    });
  } catch (error) {
    return res.json({
      success: false,
      error: "Failed to get selected user's details",
    });
  }
};
