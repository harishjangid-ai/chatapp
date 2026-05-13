import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
