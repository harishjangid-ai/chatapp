import mongoose from "mongoose";
import User from "../models/userModel.js";

export const users = async (req, res) => {
  try {
    const loggedInUserId = new mongoose.Types.ObjectId(req.user.userId);

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: loggedInUserId },
        },
      },
      {
        $lookup: {
          from: "chats",
          let: { otherUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$otherUserId", "$participants"] },
                    { $in: [loggedInUserId, "$participants"] },
                  ],
                },
              },
            },
            { $sort: { lastMessageTime: -1 } },
            { $limit: 1 },
          ],
          as: "chat",
        },
      },
      {
        $addFields: {
          lastMessageTime: {
            $ifNull: [{ $arrayElemAt: ["$chat.lastMessageTime", 0] }, null],
          },
        },
      },
      {
        $sort: {
          lastMessageTime: -1,
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    return res.json({ users });
  } catch (error) {
    return res.json({ success: false, error: "Failed to fetch users" });
  }
};
