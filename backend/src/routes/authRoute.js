import e from "express";
import { signUp } from "../controller/signUpController.js";
import { getCurrentUser, loginUser, logoutUser } from "../controller/loginController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const authRouter = e.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", loginUser);
authRouter.get("/me", verifyToken, getCurrentUser);
authRouter.post("/logout", verifyToken, logoutUser);

export default authRouter;
