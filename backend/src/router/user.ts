import express from "express";
import { getAllUsers, getMe, updateProfile, userLogin, UserLogOut, userSignup } from "../controller/user";
import { authenticateToken } from "../middleware/auth";


const UserRouter = express.Router();

UserRouter.post("/signup", userSignup);
UserRouter.post("/login", userLogin);
UserRouter.post("/logout", UserLogOut);
UserRouter.patch("/profile", authenticateToken, updateProfile);
UserRouter.get("/all-users", authenticateToken, getAllUsers);
UserRouter.get("/me", authenticateToken, getMe);



export default UserRouter;