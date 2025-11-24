"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ticket_1 = require("../controller/ticket");
const auth_1 = require("../middleware/auth");
const TicketRouter = express_1.default.Router();
TicketRouter.post("/create", auth_1.authenticateToken, ticket_1.createTicket);
TicketRouter.get("/", auth_1.authenticateToken, ticket_1.getAllTickets);
TicketRouter.get("/ticket/:id", auth_1.authenticateToken, ticket_1.getTicketById);
TicketRouter.patch("/:id/status", auth_1.authenticateToken, ticket_1.updateTicketStatus);
exports.default = TicketRouter;
//# sourceMappingURL=ticket.js.map