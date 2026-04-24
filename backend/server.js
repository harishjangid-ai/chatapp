import e from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./src/config/db.js";
import dotenv from "dotenv";
import authRouter from "./src/routes/authRoute.js";
import { chatRouter } from "./src/routes/chatRoute.js";
import cookieParser from 'cookie-parser';

const app = e();
connectDB();
dotenv.config();

app.use(cookieParser());
app.use(e.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.get("/", (req, res) => {
  res.send({message: "Hello World!"});
});

app.use("/api", authRouter);
app.use("/api", chatRouter);

const PORT = process.env.PORT || 5050;
app.listen(PORT)