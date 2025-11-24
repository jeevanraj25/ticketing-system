"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserSignup = void 0;
const inngest_1 = require("inngest");
const prisma_1 = require("../../db/prisma");
const client_1 = require("../client");
const mail_1 = require("../../utils/mail");
exports.onUserSignup = client_1.inngest.createFunction({ id: "on-user-signup", retries: 2 }, { event: "user.signup" }, async ({ event, step }) => {
    try {
        const { email } = event.data;
        const user = await step.run("get user signup", async () => {
            const user = await prisma_1.prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            if (!user) {
                throw new inngest_1.NonRetriableError("User not found in the Database");
            }
            return user;
        });
        await step.run("send Welcome email", async () => {
            const subject = "Welcome to AI Agents!";
            const html = `<h1>Welcome to AI Agents, ${user.email}!</h1>
                <p>We're excited to have you on board. Get ready to explore the power of AI-driven agents.</p>
                <p>Best regards,<br/>The AI Agents Team</p>
                `;
            await (0, mail_1.sendEmail)(user.email, subject, html);
        });
        return { success: true };
    }
    catch (error) {
        console.log("error ", error);
        return { success: false };
    }
});
//# sourceMappingURL=on-signup.js.map