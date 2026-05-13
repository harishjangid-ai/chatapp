import e from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./src/config/db.js";
import dotenv from "dotenv";
import authRouter from "./src/routes/authRoute.js";
import { chatRouter } from "./src/routes/chatRoute.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./src/routes/userRoute.js";
import { app, server } from "./src/socket/socket.js";

connectDB();
dotenv.config();

app.use(cookieParser());
app.use(e.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
const PORT = process.env.PORT || 5050;

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: `Api running on ${PORT} and http://localhost:${PORT}`,
  });
});

app.use("/api", authRouter);
app.use("/api", chatRouter);
app.use("/api", userRouter);

server.listen(PORT);
