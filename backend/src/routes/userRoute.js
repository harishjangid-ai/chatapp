import e from 'express'
import { verifyToken } from '../middleware/verifyToken.js';
import { getSelectedUser, users } from '../controller/userController.js';

export const userRouter = e.Router();

userRouter.get("/users", verifyToken, users)
userRouter.get("/selected-user/:id", getSelectedUser)