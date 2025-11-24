"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.updateProfile = exports.UserLogOut = exports.userLogin = exports.userSignup = void 0;
const prisma_1 = require("../../db/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("../../inngest/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSignup = async (req, res) => {
    try {
        const { email, password, skills = [] } = req.body;
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashPassword = bcrypt_1.default.hashSync(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                email,
                password: hashPassword,
                skills,
            }
        });
        //Fire Inngest Event Here
        await client_1.inngest.send({
            name: "user.signup",
            data: {
                email: user.email,
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
        res.status(201).json({ user, token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.userSignup = userSignup;
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const IMatch = bcrypt_1.default.compareSync(password, user.password);
        if (!IMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ user, token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
exports.userLogin = userLogin;
const UserLogOut = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
exports.UserLogOut = UserLogOut;
const updateProfile = async (req, res) => {
    try {
        const { skills = [], role, email } = req.body;
        if (req.user?.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const checkUser = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!checkUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const updateData = {};
        if (skills.length > 0) {
            updateData.skills = skills;
        }
        updateData.role = role;
        const user = await prisma_1.prisma.user.update({
            where: { email },
            data: updateData
        });
        res.status(200).json({ user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
exports.updateProfile = updateProfile;
const getAllUsers = async (req, res) => {
    try {
        if (req.user?.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const users = await prisma_1.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                skills: true,
                createdAt: true,
            }
        });
        res.status(200).json({ users });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=user.js.map