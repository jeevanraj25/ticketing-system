"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = __importDefault(require("./router/user"));
const ticket_1 = __importDefault(require("./router/ticket"));
const express_2 = require("inngest/express");
const client_1 = require("../inngest/client");
const on_signup_1 = require("../inngest/functions/on-signup");
const on_ticket_create_1 = require("../inngest/functions/on-ticket-create");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/ticket", ticket_1.default);
app.use("/api/v1/inngest", (0, express_2.serve)({
    client: client_1.inngest,
    functions: [on_signup_1.onUserSignup, on_ticket_create_1.onTicketCreate],
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map