import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./router/user";
import TicketRouter from "./router/ticket";
import {serve} from "inngest/express";
import { inngest } from "../inngest/client";
import {onUserSignup} from "../inngest/functions/on-signup"
import {onTicketCreate} from "../inngest/functions/on-ticket-create";


dotenv.config();


const app = express();
const port = process.env.PORT || 3001;



app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());



app.use("/api/v1/user", UserRouter);
app.use("/api/v1/ticket", TicketRouter);
app.use(
  "/api/v1/inngest",
  serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreate],
  })
);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
