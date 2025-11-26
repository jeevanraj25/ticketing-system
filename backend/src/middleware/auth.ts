
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const authenticateToken = (req: any, res: any, next: any) => {
    try {
        console.log("Cookies received:", req.cookies);
        const token = req.cookies.token;
        if (!token) {
           
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);


        if (!decoded) {
          
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = decoded;
        next();

    } catch (error) {
        console.log("Auth error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}