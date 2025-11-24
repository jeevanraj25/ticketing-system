"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onTicketCreate = void 0;
const inngest_1 = require("inngest");
const prisma_1 = require("../../db/prisma");
const client_1 = require("../client");
const mail_1 = require("../../utils/mail");
const ai_1 = __importDefault(require("../../utils/ai"));
console.log("[inngest:function] on-ticket-create module loaded");
exports.onTicketCreate = client_1.inngest.createFunction({ id: "on-ticket-create", retries: 2 }, { event: "ticket.created" }, async ({ event, step }) => {
    try {
        const { ticketId } = event.data;
        // get the ticket details from the database
        const ticket = await step.run("get ticket details", async () => {
            const ticketObject = await prisma_1.prisma.ticket.findUnique({
                where: {
                    id: ticketId
                }
            });
            if (!ticketObject) {
                throw new inngest_1.NonRetriableError("Ticket not found in the Database");
            }
            return ticketObject;
        });
        // update the ticket status to 'processing'
        await step.run("update ticket status to processing", async () => {
            await prisma_1.prisma.ticket.update({
                where: { id: ticketId },
                data: { status: "processing" }
            });
        });
        // analyze the ticket using AI
        const AiResult = await (0, ai_1.default)(ticket);
        // ai processing  
        const skills = await step.run("AI processing", async () => {
            let skills = [];
            if (AiResult) {
                await prisma_1.prisma.ticket.update({
                    where: { id: ticketId },
                    data: {
                        priority: ["low", "medium", "high"].includes(AiResult.priority) ? AiResult.priority : "low",
                        helpfulResources: AiResult.helpfulNotes,
                        relatedSkills: AiResult.relatedSkills,
                        deadline: new Date(AiResult.deadline),
                    }
                });
                skills = AiResult.relatedSkills;
            }
            return skills;
        });
        // find the moderators with matching skills
        const moderator = await step.run("find appropriate moderator", async () => {
            let moderator;
            if (skills.length === 0 || !skills) {
                // no skills identified, assign any available moderator
                moderator = await prisma_1.prisma.user.findFirst({
                    where: {
                        role: "MODERATOR",
                    }
                });
                return moderator;
            }
            moderator = await prisma_1.prisma.user.findFirst({
                where: {
                    role: "MODERATOR",
                    OR: skills.map((skill) => ({
                        skills: {
                            has: skill,
                        },
                    }))
                }
            });
            if (!moderator) {
                moderator = await prisma_1.prisma.user.findFirst({
                    where: {
                        role: "MODERATOR",
                    }
                });
            }
            if (moderator) {
                // assign the ticket to the moderator
                await prisma_1.prisma.ticket.update({
                    where: { id: ticketId },
                    data: {
                        assignedTo: { connect: { id: moderator.id } }
                    }
                });
            }
            return moderator;
        });
        // notify the moderator via email
        await step.run("notify moderator", async () => {
            if (moderator && moderator.email) {
                const subject = `New Ticket Assigned: ${ticket.title}`;
                const html = `<h1>New Ticket Assigned</h1>
                    <p>A new support ticket has been assigned to you.</p>
                    <h2>Ticket Details:</h2>
                    <p><strong>Title:</strong> ${ticket.title}</p>
                    <p><strong>Description:</strong> ${ticket.description}</p>
                    <p><strong>Summary:</strong> ${AiResult ? AiResult.summary : "N/A"}</p>
                    <p><strong>Priority:</strong> ${AiResult ? AiResult.priority : "N/A"}</p>
                    <p><strong>Helpful Notes:</strong> ${AiResult ? AiResult.helpfulNotes : "N/A"}</p>
                    <p>Please review and take the necessary actions.</p>
                    <p>Best regards,<br/>AI Agents Team</p>
                    `;
                await (0, mail_1.sendEmail)(moderator.email, subject, html);
            }
        });
        return { success: true };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
//# sourceMappingURL=on-ticket-create.js.map