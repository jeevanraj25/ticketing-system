import { prisma } from "../../db/prisma"
import { inngest } from "../../inngest/client";

export const createTicket = async (req: any, res: any) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and Description are required" });
        }

       

        const ticket = await prisma.ticket.create({
            data: {
                title,
                description,
                createdBy: {
                    connect: { id: req.user.userId }
                }
            }
        });



        await inngest.send({
            name: "ticket.created",
            data: {
                ticketId: ticket.id,
                title,
                description,
                createdBy: req.user.userId,
            }
        })

        res.status(201).json({ message: "Ticket created and processing started" });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
}

export const getAllTickets = async (req: any, res: any) => {
    try {
        res.set('Cache-Control', 'no-store');
        let tickets;
       
        if (req.user.role.toLowerCase() !== "user") {

            // admin / non-user: return all tickets with assignedTo populated
            tickets = await prisma.ticket.findMany({
                include: {
                    assignedTo: {
                        select: {
                            id: true,
                            email: true,
                        }
                    },
                },
                orderBy: { createdAt: "desc" }
            });
        } else {
            // regular user: return only tickets created by them, select limited fields
            tickets = await prisma.ticket.findMany({
                where: { createdById: req.user.userId },
                select: { id: true, title: true, description: true, status: true, createdAt: true },
                orderBy: { createdAt: "desc" }
            });
        }

        res.status(200).json({ tickets });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
}

export const getTicketById = async (req: any, res: any) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

        res.set('Cache-Control', 'no-store');
        let ticket

        if (req.user.role !== "user") {
            // admin / non-user: return full ticket with assignedTo populated
            ticket = await prisma.ticket.findUnique({
                where: { id },
                include: {
                    assignedTo: {
                        select: {
                            id: true,
                            email: true,
                        }
                    }
                }
            });
        } else {
            // regular user: return only if they created it, and select limited fields
            ticket = await prisma.ticket.findFirst({
                where: { id, createdById: req.user.userId },
                select: { id: true, title: true, description: true, status: true, createdAt: true },
            })
        }

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        return res.status(200).json({ ticket });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
}

export const updateTicketStatus = async (req: any, res: any) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
        if (!status) return res.status(400).json({ message: "Status is required" });

        // Check if user is admin or moderator
        if (req.user.role.toLowerCase() === 'user') {
            return res.status(403).json({ message: "Unauthorized: Only admins and moderators can update ticket status" });
        }

        const ticket = await prisma.ticket.update({
            where: { id },
            data: { status }
        });

        res.status(200).json({ message: "Ticket status updated", ticket });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}