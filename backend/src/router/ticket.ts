import express from "express";
import { createTicket, getAllTickets, getTicketById } from "../controller/ticket";
import { authenticateToken } from "../middleware/auth";


const TicketRouter = express.Router();

TicketRouter.post("/create",authenticateToken,createTicket);
TicketRouter.get("/",authenticateToken,getAllTickets);
TicketRouter.get("/ticket/:id",authenticateToken,getTicketById)



export default TicketRouter;

