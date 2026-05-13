import { Server } from "socket.io";
import http from "http";
import e from "express";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

const app = e();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("register", (userId) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);
    socket.userId = userId;

    const userArray = [...onlineUsers.keys()];
    io.emit("get_online_users", userArray);
  });

  socket.on("send_message", async (data) => {
    try {
      const { message, receiverId, senderId } = data;

      const participants = [senderId, receiverId].sort();

      let chat = await Chat.findOne({
        participants: { $all: participants, $size: 2 },
      });

      if (!chat) {
        chat = await Chat.create({ participants });
        socket.join(chat._id.toString());
      }
      const chatRoom = chat._id.toString();
      socket.join(chatRoom);

      const senderSocket = onlineUsers.get(senderId);
      const receiverSocket = onlineUsers.get(receiverId);

      if (senderSocket) {
        io.to(senderSocket).emit("chat_created", chatRoom);
      }

      if (receiverSocket) {
        io.to(receiverSocket).emit("chat_created", chatRoom);
      }

      const newMsg = await Message.create({
        message,
        senderId,
        chatId: chat._id,
      });
      await Chat.findByIdAndUpdate(chatRoom, { lastMessageTime: Date.now() });
      io.to(chat._id.toString()).emit("receive_message", newMsg);
    } catch (err) {
      console.log("Socket error:", err);
    }
  });

  socket.on("disconnect", () => {
    const userId = socket.userId;

    if (userId && onlineUsers.has(userId)) {
      const sockets = onlineUsers.get(userId);
      sockets.delete(socket.id);

      if (sockets.size === 0) {
        onlineUsers.delete(userId);
      }
    }

    io.emit("get_online_users", [...onlineUsers.keys()]);
  });
});

export { server, app };
