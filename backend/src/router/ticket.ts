import express from "express";
import { createTicket, getAllTickets, getTicketById, updateTicketStatus } from "../controller/ticket";
import { authenticateToken } from "../middleware/auth";


const TicketRouter = express.Router();

TicketRouter.post("/create", authenticateToken, createTicket);
TicketRouter.get("/", authenticateToken, getAllTickets);
TicketRouter.get("/ticket/:id", authenticateToken, getTicketById)
TicketRouter.patch("/:id/status", authenticateToken, updateTicketStatus);



export default TicketRouter;
