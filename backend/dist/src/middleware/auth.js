"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    try {
        console.log("Cookies received:", req.cookies);
        const token = req.cookies.token;
        if (!token) {
            console.log("No token found in cookies");
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            console.log("Token verification failed");
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log("Auth error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map