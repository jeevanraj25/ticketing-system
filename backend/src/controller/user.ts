import { prisma } from "../../db/prisma"
import brcypt from "bcrypt";
import { inngest } from "../../inngest/client";
import jwt from "jsonwebtoken";



export const userSignup = async (req: any, res: any) => {

    try {
        const { email, password, skills = [] } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashPassword = brcypt.hashSync(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
                skills,
            }
        });



        //Fire Inngest Event Here

        await inngest.send({
            name: "user.signup",
            data: {
                email: user.email,
            }
        });

        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY as string, { expiresIn: "7d" });

        res.status(201).json({ user: { ...user, role: user.role.toLowerCase() }, token });


    } catch (error) {
        console.log(
            error
        );
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const userLogin = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;


        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const IMatch = brcypt.compareSync(password, user.password);
        if (!IMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }



        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY as string, { expiresIn: "7d" });


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });


        res.status(200).json({ user: { ...user, role: user.role.toLowerCase() }, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}




export const UserLogOut = async (req: any, res: any) => {
    try {

        res.clearCookie("token");

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};



export const updateProfile = async (req: any, res: any) => {
    try {
        const { skills = [], role, email } = req.body;

        if (req.user?.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const checkUser = await prisma.user.findUnique({
            where: { email }
        });

        if (!checkUser) {
            return res.status(404).json({ message: "User not found" });
        }


        const updateData: any = {};

        if (skills.length > 0) {
            updateData.skills = skills;
        }

        if (role) {
            updateData.role = role.toUpperCase();
        }

        const user = await prisma.user.update({
            where: { email },
            data: updateData
        });


        res.status(200).json({ user: { ...user, role: user.role.toLowerCase() } });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}



export const getAllUsers = async (req: any, res: any) => {
    try {
        if (req.user?.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                skills: true,
                createdAt: true,
            }
        });

        const usersWithLowerCaseRole = users.map(user => ({
            ...user,
            role: user.role.toLowerCase()
        }));

        res.status(200).json({ users: usersWithLowerCaseRole });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const getMe = async (req: any, res: any) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                role: true,
                skills: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user: { ...user, role: user.role.toLowerCase() } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}