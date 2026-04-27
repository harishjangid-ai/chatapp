import e from "express";
import { sendMessage, getMyChat } from "../controller/messageController.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const chatRouter = e.Router();
chatRouter.post("/send-message", verifyToken ,sendMessage);
chatRouter.get("/my-chat/:id", verifyToken, getMyChat);