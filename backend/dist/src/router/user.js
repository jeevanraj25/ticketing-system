"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const auth_1 = require("../middleware/auth");
const UserRouter = express_1.default.Router();
UserRouter.post("/signup", user_1.userSignup);
UserRouter.post("/login", user_1.userLogin);
UserRouter.post("/logout", user_1.UserLogOut);
UserRouter.patch("/profile", auth_1.authenticateToken, user_1.updateProfile);
UserRouter.get("/all-users", auth_1.authenticateToken, user_1.getAllUsers);
UserRouter.get("/me", auth_1.authenticateToken, user_1.getMe);
exports.default = UserRouter;
//# sourceMappingURL=user.js.map